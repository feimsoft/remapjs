import { getTargetConfiguration, RemapTargetConfiguration, TypeOrSourceKey } from './utils';

interface MapRecordContext {
    preffix?: string;
}

interface MapSource<T> {
    alias?: string;
    type: ({ new(...args: any[]): T });
    records: T[];
}

interface MapRecordsetOptions {
    sources?: MapSource<any>[];
    ignoreCase?: boolean;
}

function findValue(record: any, key: string, options: MapRecordsetOptions): any {
    const keyMatch = options.ignoreCase
        ? Object.getOwnPropertyNames(record).find(x => x.toLowerCase() === key.toLowerCase())
        : key;

    if (!!keyMatch) {
        return record[keyMatch];
    }

    return null;
}

function mapColumns(record: any, result: any, preffix: string, config: RemapTargetConfiguration, recordOptions: MapRecordsetOptions): boolean {
    let foundProperties = false;

    for (const column of config.columns) {
        const columnOptions = Object.assign({}, column.options);
        const key = preffix + (columnOptions.name || column.property);
        const value = findValue(record, key, recordOptions);
        if (!!value) {
            foundProperties = true;
        }
        result[column.property] = value;
    }

    return foundProperties;
}

function getSource(typeOrSourceKey: TypeOrSourceKey, sources: MapSource<any>[]): MapSource<any> | null {
    if (!sources) {
        return null;
    }
    const source = typeof typeOrSourceKey === 'string'
        ? sources.find(x => x.alias === typeOrSourceKey)
        : sources.find(x => x.type === typeOrSourceKey);
    return source || null;
}

function mapManyToOnes(record: any, result: any, preffix: string, config: RemapTargetConfiguration, recordOptions: MapRecordsetOptions, context: MapRecordContext): boolean {
    let foundProperties = false;

    for (const expand of config.manyToOnes) {
        const source = getSource(expand.typeOrSourceKey, recordOptions.sources);
        const relRecord = source && expand.options.matchProperty && expand.options.property
            ? source.records.find(x => x[expand.options.matchProperty] === result[expand.options.property])
            : null;

        const expandResult = mapRecord(expand.typeOrSourceKey, relRecord || record, recordOptions, {
            ...context,
            preffix: relRecord ? null : preffix + (expand.options.preffix || expand.property)
        });

        result[expand.property] = expandResult;

        if (!!expandResult) {
            foundProperties = true;
        }
    }

    return foundProperties;
}

function mapOneToManies(result: any, config: RemapTargetConfiguration, recordOptions: MapRecordsetOptions, context: MapRecordContext): boolean {
    let foundProperties = false;

    for (const expand of config.oneToManies) {
        const source = getSource(expand.typeOrSourceKey, recordOptions.sources);
        const relRecords = source && expand.options.inverseProperty && expand.options.property
            ? source.records.filter(x => x[expand.options.inverseProperty] === result[expand.options.property])
            : null;

        if (relRecords) {
            result[expand.property] = relRecords.map(x => mapRecord(expand.typeOrSourceKey, x, recordOptions, {
                ...context,
                preffix: null
            }));
            foundProperties = true;
        } else {
            result[expand.property] = null;
        }
    }

    return foundProperties;
}

function mapRecord<T extends { new(...args: any[]): T }>(recordTypeOrSourceKey: TypeOrSourceKey<T>, rawRecord: any, options?: MapRecordsetOptions, context?: MapRecordContext): InstanceType<T> {
    context = Object.assign({}, context);
    options = Object.assign({}, options);

    const source = getSource(recordTypeOrSourceKey, options.sources);
    if (source === null && typeof recordTypeOrSourceKey === 'string') {
        throw new Error('Source type or key not registered in options');
    }

    const SourceType: { new(...args: any[]): T } = source
        ? source.type
        : typeof recordTypeOrSourceKey !== 'string'
            ? recordTypeOrSourceKey
            : null;

    const result: InstanceType<T> = (new SourceType()) as InstanceType<T>;
    const config = getTargetConfiguration(result);

    const preffix = (context.preffix ? context.preffix + '.' : '');
    let foundProperties = false;

    foundProperties = mapColumns(rawRecord, result, preffix, config, options) || foundProperties;
    foundProperties = mapManyToOnes(rawRecord, result, preffix, config, options, context) || foundProperties;
    foundProperties = mapOneToManies(result, config, options, context) || foundProperties;

    if (foundProperties) {
        return result;
    } else {
        return null;
    }
}

export function remap<T extends { new() }>(RecordType: T, recordset: Object[], options?: MapRecordsetOptions): Array<InstanceType<T>> {
    const appliedOptions = Object.assign({}, remap.globalConfig, options);
    const output: Array<InstanceType<T>> = [];
    for (const record of recordset) {
        output.push(mapRecord<T>(RecordType, record, appliedOptions));
    }
    return output;
}

remap.globalConfig = {
    ignoreCase: false
} as MapRecordsetOptions;