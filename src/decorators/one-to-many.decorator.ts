const metadataKey = Symbol('one-to-many');

interface OneToManyOptions {
    /** */
    property: string;
    /** */
    inverseProperty: string;
}

export const OneToMany = (Type: ({ new() }), options: OneToManyOptions) => {
    return (target: any, propertyKey: string) => {
        const oneToMany = getOneToManyMetadata(target) || [];
        oneToMany.push({ propertyKey, options: { Type, ...options } });
        Reflect.defineMetadata(metadataKey, oneToMany, target);
    };
};

export function getOneToManyMetadata(target: any) {
    return Reflect.getMetadata(metadataKey, target);
}
