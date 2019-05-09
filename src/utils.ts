export interface RemapTarget<TOptions> {
    property: string;
    options: TOptions;
}

export interface RemapTargetWithType<TOptions> extends RemapTarget<TOptions> {
    Type: ({ new(...args: any): any });
}

export interface ColumnOptions {
    /** Column name in record */
    name: string;
}

export interface ManyToOneOptions {
    /** Prefix of the column that refers to the related record. */
    preffix?: string;
    /** Property name */
    property?: string;
    /** Matches with relation property */
    matchProperty?: string;
}

export interface OneToManyOptions {
    /** */
    property: string;
    /** */
    inverseProperty: string;
}

export interface RemapTargetConfiguration {
    columns: RemapTarget<ColumnOptions>[];
    manyToOnes: RemapTargetWithType<ManyToOneOptions>[];
    oneToManies: RemapTargetWithType<OneToManyOptions>[];
}

export function getTargetConfiguration(target: any): RemapTargetConfiguration | null {
    if (target) {
        if (!target.__remapjs__) {
            Object.defineProperty(target, '__remapjs__', {
                enumerable: false,
                configurable: false,
                writable: false,
                value: {
                    columns: [],
                    manyToOnes: [],
                    oneToManies: []
                }
            })
        }
        return target.__remapjs__;
    }
    return null;
}