import { getTargetConfiguration, OneToManyOptions, TypeOrSourceKey } from "../utils";

const metadataKey = Symbol('one-to-many');



export const OneToMany = (typeOrSourceKey: TypeOrSourceKey, options: OneToManyOptions) => {
    return (target: any, property: string) => {
        const config = getTargetConfiguration(target);
        config.oneToManies.push({ property, options, typeOrSourceKey });
    };
};
