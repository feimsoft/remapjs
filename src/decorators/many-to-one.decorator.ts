const metadataKey = Symbol('many-to-one');

interface ManyToOneOptions {
    /** Prefix of the column that refers to the related record. */
    preffix?: string;
    /** Property name */
    property?: string;
    /** Matches with relation property */
    matchProperty?: string;
}

export const ManyToOne = (Type: ({ new() }), options?: ManyToOneOptions) => {
    return (target: any, propertyKey: string) => {
        const manyToOne = getManyToOneMetadata(target) || [];
        manyToOne.push({ propertyKey, options: { Type, ...options } });
        Reflect.defineMetadata(metadataKey, manyToOne, target);
    };
};

export function getManyToOneMetadata(target: any) {
    return Reflect.getMetadata(metadataKey, target);
}
