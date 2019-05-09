# Description
remapjs facilitates records transformation into entity models.
It is developed in Typescript and the entities configuration is with decorators. Which is very simple.

NOTE: It is not an ORM, it only transforms the recordset in the specified entities.

# How to use
## Define your entity model

The following decorators are provided to configure the entities.

### Column
Specifies that a property is to be mapped with a column in the record.

#### Decorator
```ts
const Column = (options?: ColumnOptions) => any;
```
```ts
interface ColumnOptions {
    name: string; 
}
```

#### Example
```ts
class DbEntity {
    @Column() id: number;
    @Column() name: string;
}

const mainRecords = [
    { id: 1, name: 'test 1' },
    { id: 2, name: 'test 2' }
];
const outputData = map(DbEntity, mainRecords);
```

### ManyToOne
Specifies that a property of a single record is going to be mapped with a second set of records provided or if the name of the column contains "." the navigation to complex objects will be carried out.

#### Decorator
```ts
const ManyToOne = (Type: ({ new() }), options?: ManyToOneOptions) => any;
```
```ts
interface ManyToOneOptions {
    /** Prefix of the column that refers to the related record. */
    preffix?: string;
    /** Property name */
    property?: string;
    /** Matches with relation property */
    matchProperty?: string;
}
```

#### Example
```ts
class ManyRelationEntity {
    @Column() id: number;
    @Column() name: string;
}

class DbEntity {
    @Column() id: number;
    @Column() name: string;
    @Column() relationId: string;

    @ManyToOne(RelDbEntity, {property: 'relationId', matchProperty: 'id' })
    relation: ManyRelationEntity;
}

const mainRecords = [
    { id: 1, name: 'test 1', relationId: 1 },
    { id: 2, name: 'test 2', relationId: 2 }
];

const manyRecords =  [
    { id: 1, name: 'Prueba rel complex 1' }, 
    { id: 2, name: 'Prueba rel complex 2' }
];

const outputData = map(DbEntity, mainRecords, {
    sources: [
        { type: ManyRelationEntity, records: manyRecords }
    ]
});
```

### OneToMany
Specifies that records that match the specified criteria will be retrieved from a source.

#### Decorators
```ts
const OneToMany = (Type: ({ new() }), options: OneToManyOptions) => any;
```
```ts
interface OneToManyOptions {
    /** */
    property: string;
    /** */
    inverseProperty: string;
}
```

#### Example
```ts
class ManyRelationEntity {
    @Column() id: number;
    @Column() name: string;
    @Column() dbId: number;
}

class DbEntity {
    @Column() id: number;
    @Column() name: string;
    @OneToMany(ManyRelationEntity, { property: 'id', inverseProperty: 'dbId' })
    relationsMany: ManyRelationEntity[];
}

const mainRecords = [
    { id: 1, name: 'test 1' },
    { id: 2, name: 'test 2' }
];

const manyRecords =  [
    { id: 1, dbId: 1, nombre: 'Test rel complex 1' }, 
    { id: 2, dbId: 2,  nombre: 'Test rel complex 2' }
];

const outputData = map(DbEntity, mainRecords, {
    sources: [
        { type: ManyRelationEntity, records: manyRecords }
    ]
});
```