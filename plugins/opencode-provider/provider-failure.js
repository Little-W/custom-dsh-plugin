// Share one classification path for streamed provider-error events and thrown/nested errors.
const TIMEOUT = /\bUND_ERR_(?:BODY|HEADERS|CONNECT)_TIMEOUT\b|\bETIMEDOUT\b|\bTimeoutError\b|\b(?:body|headers?|connect|connection|request|response|read|idle)\s+(?:timed?\s*out|timeout)\b/i;
const NETWORK = /UND_ERR_SOCKET|ERR_SOCKET|ECONNRESET|ECONNREFUSED|EAI_AGAIN|ENETUNREACH|EHOSTUNREACH|ECONNABORTED|EPIPE|socket hang up|other side closed|fetch failed|network (?:error|connection)|connection (?:reset|closed|refused)|connection lost while reading|premature (?:close|end)/i;
// OpenAI can signal temporary capacity pressure with an application code and no HTTP status.
const OVERLOADED = /\bserver[_\s-]+is[_\s-]+overloaded\b|\bservers?\b.{0,40}\boverloaded\b|\boverloaded\s+servers?\b/i;

function details(value, seen = new Set(), result = { text: [], statuses: [] }) {
    if (typeof value === 'string') { result.text.push(value); return result; }
    if (!value || typeof value !== 'object' || seen.has(value)) return result;
    seen.add(value);
    for (const key of ['message', 'code', 'name']) if (typeof value[key] === 'string') result.text.push(value[key]);
    for (const status of [value.status, value.statusCode, value.http?.status]) {
        if (Number.isInteger(status)) result.statuses.push(status);
    }
    for (const key of ['cause', 'error', 'reason']) details(value[key], seen, result);
    if (Array.isArray(value.errors)) for (const error of value.errors) details(error, seen, result);
    return result;
}

export function classifyProviderFailure(value, classification) {
    if (classification === 'context-overflow') return 'CONTEXT_WINDOW_EXCEEDED';
    if (classification === 'payload-too-large') return 'PAYLOAD_TOO_LARGE';
    const info = details(value), text = info.text.join('\n');
    const statuses = [...info.statuses, ...[...text.matchAll(/\bHTTP\s+(\d{3})\b/gi)].map(match => Number(match[1]))];
    if (statuses.some(status => status === 401 || status === 403)) return 'INVALID_CREDENTIAL';
    if (OVERLOADED.test(text)) return 'SERVER';
    if (statuses.includes(429)) return 'RATE_LIMIT';
    if (statuses.some(status => status >= 500 && status <= 599)) return 'SERVER';
    if (statuses.some(status => status === 408 || status === 409)) return 'TIMEOUT';
    if (statuses.some(status => status >= 400 && status < 500)) return 'PROVIDER_ERROR';
    if (TIMEOUT.test(text)) return 'TIMEOUT';
    if (classification === 'network' || NETWORK.test(text)) return 'TRANSPORT';
    return 'PROVIDER_ERROR';
}
