import { getTargetConfiguration, ManyToOneOptions, TypeOrSourceKey } from "../utils";

const metadataKey = Symbol('many-to-one');



export const ManyToOne = (typeOrSourceKey: TypeOrSourceKey, options?: ManyToOneOptions) => {
    return (target: any, property: string) => {
        const config = getTargetConfiguration(target);
        config.manyToOnes.push({
            property,
            typeOrSourceKey,
            options: Object.assign({}, options),
        });
    };
};
