import { getTargetConfiguration, ManyToOneOptions } from "../utils";

const metadataKey = Symbol('many-to-one');



export const ManyToOne = (Type: ({ new() }), options?: ManyToOneOptions) => {
    return (target: any, property: string) => {
        const config = getTargetConfiguration(target);
        config.manyToOnes.push({
            property,
            Type,
            options: Object.assign({}, options),
        });
    };
};
