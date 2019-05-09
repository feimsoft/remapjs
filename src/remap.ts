import { getTargetConfiguration, RemapTargetConfiguration } from './utils';

interface MapRecordContext {
    preffix?: string;
}

interface MapSource {
    type: ({ new() });
    records: any[];
}

interface MapRecordsetOptions {
    sources?: MapSource[];
    ignoreCase?: boolean;
}

function findValue(record: any, key: string, options: MapRecordsetOptions): any {
    const keyMatch = options.ignoreCase
        ? Object.getOwnPropertyNames(record).find(x => x.toLowerCase() === key.toLowerCase())
        : key;

    if (keyMatch !== undefined) {
        return record[keyMatch];
    }

    return undefined;
}

function mapColumns(record: any, result: any, preffix: string, config: RemapTargetConfiguration, recordOptions: MapRecordsetOptions): boolean {
    let foundProperties = false;

    for (const column of config.columns) {
        const { options: columnOptions } = column;
        const key = preffix + (columnOptions.name || column.property);
        const value = findValue(record, key, recordOptions);
        if (value !== undefined) {
            foundProperties = true;
        }
        result[column.property] = value;
    }

    return foundProperties;
}

function mapManyToOnes(record: any, result: any, preffix: string, config: RemapTargetConfiguration, recordOptions: MapRecordsetOptions, context: MapRecordContext): boolean {
    let foundProperties = false;

    for (const expand of config.manyToOnes) {
        const source = recordOptions.sources && recordOptions.sources.find(x => x.type === expand.Type);
        const relRecord = source && expand.options.matchProperty && expand.options.property
            ? source.records.find(x => x[expand.options.matchProperty] === result[expand.options.property])
            : null;

        const expandResult = mapRecord(expand.Type, relRecord || record, recordOptions, {
            ...context,
            preffix: relRecord ? null : preffix + (expand.options.preffix || expand.property)
        });

        if (expandResult !== undefined) {
            result[expand.property] = expandResult;
            foundProperties = true;
        }
    }

    return foundProperties;
}

function mapOneToManies(result: any, config: RemapTargetConfiguration, recordOptions: MapRecordsetOptions, context: MapRecordContext): boolean {
    let foundProperties = false;

    for (const expand of config.oneToManies) {
        const source = recordOptions.sources && recordOptions.sources.find(x => x.type === expand.Type);
        const relRecords = source && expand.options.inverseProperty && expand.options.property
            ? source.records.filter(x => x[expand.options.inverseProperty] === result[expand.options.property])
            : undefined;

        if (relRecords) {
            result[expand.property] = relRecords.map(x => mapRecord(expand.Type, x, recordOptions, {
                ...context,
                preffix: null
            }));
            foundProperties = true;
        }
    }

    return foundProperties;
}

function mapRecord<T extends { new() }>(RecordType: T, record: any, options?: MapRecordsetOptions, context?: MapRecordContext): InstanceType<T> {
    context = Object.assign({}, context);
    options = Object.assign({}, options);

    const result = new RecordType();
    const config = getTargetConfiguration(result);

    const preffix = (context.preffix ? context.preffix + '.' : '');
    let foundProperties = false;

    foundProperties = mapColumns(record, result, preffix, config, options) || foundProperties;
    foundProperties = mapManyToOnes(record, result, preffix, config, options, context) || foundProperties;
    foundProperties = mapOneToManies(result, config, options, context) || foundProperties;

    if (foundProperties) {
        return result;
    } else {
        return undefined;
    }
}

export function remap<T extends { new() }>(RecordType: T, recordset: Object[], options?: MapRecordsetOptions): Array<InstanceType<T>> {
    const output: Array<InstanceType<T>> = [];
    for (const record of recordset) {
        output.push(mapRecord(RecordType, record, options));
    }
    return output;
}