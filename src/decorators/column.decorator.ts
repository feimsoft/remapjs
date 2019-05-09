import { getTargetConfiguration, ColumnOptions } from "../utils";

const columnMetadataKey = Symbol('column');


export const Column = (options?: ColumnOptions) => {
    return (target: any, property: string) => {
        const config = getTargetConfiguration(target);
        config.columns.push({ property, options });
    };
};
