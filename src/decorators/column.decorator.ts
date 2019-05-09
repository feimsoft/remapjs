const columnMetadataKey = Symbol('column');

interface ColumnOptions {
    /** Column name in record */
    name: string;
}

export const Column = (options?: ColumnOptions) => {
    return (target: any, propertyKey: string) => {
        const columns = getColumnMetadata(target) || [];
        columns.push({ propertyKey, options });
        Reflect.defineMetadata(columnMetadataKey, columns, target);
    };
};

export function getColumnMetadata(target: any) {
    return Reflect.getMetadata(columnMetadataKey, target);
}
