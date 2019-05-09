import { getTargetConfiguration, OneToManyOptions } from "../utils";

const metadataKey = Symbol('one-to-many');



export const OneToMany = (Type: ({ new() }), options: OneToManyOptions) => {
    return (target: any, property: string) => {
        const config = getTargetConfiguration(target);
        config.oneToManies.push({ property, options, Type });
    };
};
