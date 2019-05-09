
import { getColumnMetadata, Column } from './decorators/column.decorator';
import { getManyToOneMetadata, ManyToOne } from './decorators/many-to-one.decorator';
import { getOneToManyMetadata } from './decorators/one-to-many.decorator';

interface ExtraMapRecordContext {
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
        return record[key];
    }

    return undefined;
}

function mapRecord<T extends { new() }>(RecordType: T, record: any, options?: MapRecordsetOptions, context?: ExtraMapRecordContext): InstanceType<T> {
    context = Object.assign({}, context);
    options = Object.assign({}, options);

    const result = new RecordType();
    const columns = getColumnMetadata(result) || [];
    const preffix = (context.preffix ? context.preffix + '.' : '');
    let notFoundProperties = true;

    for (const column of columns) {
        const { options: columnOptions } = column;
        const key = preffix + (columnOptions.name || column.propertyKey);
        const value = findValue(record, key, options);
        if (value !== undefined) {
            notFoundProperties = false;
        }
        result[column.propertyKey] = value;
    }

    const manyToOne = getManyToOneMetadata(result) || [];
    for (const expand of manyToOne) {
        const { options: expandOptions } = expand;
        const source = options.sources && options.sources.find(x => x.type === expandOptions.Type);
        const relRecord = source && expandOptions.matchProperty && expandOptions.property
            ? source.records.find(x => x[expandOptions.matchProperty] === result[expandOptions.property])
            : null;

        const expandResult = mapRecord(expandOptions.Type, relRecord || record, options, {
            ...context,
            preffix: relRecord ? null : preffix + (expandOptions.name || expand.propertyKey)
        });
        if (expandResult !== undefined) {
            result[expand.propertyKey] = expandResult;
            notFoundProperties = false;
        }
    }

    const oneToMany = getOneToManyMetadata(result) || [];
    for (const expand of oneToMany) {
        const { options: expandOptions } = expand;
        const source = options.sources && options.sources.find(x => x.type === expandOptions.Type);
        const relRecords = source && expandOptions.inverseProperty && expandOptions.property
            ? source.records.filter(x => x[expandOptions.inverseProperty] === result[expandOptions.property])
            : undefined;

        if (relRecords) {
            result[expand.propertyKey] = relRecords.map(x => mapRecord(expandOptions.Type, x, options, {
                ...context,
                preffix: null
            }));
            notFoundProperties = false;
        }
    }

    if (!notFoundProperties) {
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