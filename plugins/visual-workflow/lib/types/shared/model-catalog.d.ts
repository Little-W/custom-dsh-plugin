/** 宿主与编辑器共用的模型目录条目；显示名称与实际调用标识分开。 */
export interface ModelCatalogEntry {
    /** 实际提供商路由。 */
    provider: string;
    /** 实际模型标识。 */
    model: string;
    /** 提供商公布的可读名称。 */
    providerName?: string;
    /** 模型公布的可读名称。 */
    modelName?: string;
    /** 模型支持的思考强度。 */
    efforts?: Array<{
        id: string;
        name: string;
    }>;
}
