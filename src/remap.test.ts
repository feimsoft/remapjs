import { Column, ManyToOne, OneToMany } from "./decorators";
import { remap } from "./remap";


test('Remap source with columns decorators', () => {
    // Arrange
    class DbEntity {
        @Column() id: number;
        @Column() name: string;
    }

    const mainRecords = [
        { id: 1, name: 'test 1' },
        { id: 2, name: 'test 2' }
    ];

    // Act
    const outputData = remap(DbEntity, mainRecords);

    // Assert
    expect(outputData).toHaveLength(2);
    expect(outputData[0]).toBeInstanceOf(DbEntity);
    expect(outputData[1]).toBeInstanceOf(DbEntity);
    expect(outputData[0].id).toEqual(1);
    expect(outputData[0].name).toEqual('test 1');
    expect(outputData[1].id).toEqual(2);
    expect(outputData[1].name).toEqual('test 2');
});

test('Remap source with many to one decorators', () => {
    // Arrange
    class ManyRelationEntity {
        @Column() id: number;
        @Column() name: string;
    }

    class DbEntity {
        @Column() id: number;
        @Column() name: string;
        @Column() relationId: string;

        @ManyToOne(ManyRelationEntity, { property: 'relationId', matchProperty: 'id' })
        relation: ManyRelationEntity;
    }

    const mainRecords = [
        { id: 1, name: 'test 1', relationId: 1 },
        { id: 2, name: 'test 2', relationId: 2 }
    ];

    const manyRecords = [
        { id: 1, name: 'Prueba rel complex 1' },
        { id: 2, name: 'Prueba rel complex 2' }
    ];

    // Act
    const outputData = remap(DbEntity, mainRecords, {
        sources: [
            { type: ManyRelationEntity, records: manyRecords }
        ]
    });

    // Assert
    expect(outputData).toHaveLength(2);
    expect(outputData[0]).toBeInstanceOf(DbEntity);
    expect(outputData[0].id).toEqual(1);
    expect(outputData[0].name).toEqual('test 1');
    expect(outputData[0].relationId).toEqual(1);
    expect(outputData[0].relation).toBeInstanceOf(ManyRelationEntity);
    expect(outputData[0].relation.id).toEqual(1);
    expect(outputData[0].relation.name).toEqual('Prueba rel complex 1');

    expect(outputData[1]).toBeInstanceOf(DbEntity);
    expect(outputData[1].id).toEqual(2);
    expect(outputData[1].name).toEqual('test 2');
    expect(outputData[1].relationId).toEqual(2);
    expect(outputData[1].relation).toBeInstanceOf(ManyRelationEntity);
    expect(outputData[1].relation.id).toEqual(2);
    expect(outputData[1].relation.name).toEqual('Prueba rel complex 2');
});

test('Remap source with many to one decorators and alias', () => {
    // Arrange
    class ManyRelationEntity {
        @Column() id: number;
        @Column() name: string;
    }

    class DbEntity {
        @Column() id: number;
        @Column() name: string;
        @Column() relationId: string;

        @ManyToOne('many1', { property: 'relationId', matchProperty: 'id' })
        relation: ManyRelationEntity;
    }

    const mainRecords = [
        { id: 1, name: 'test 1', relationId: 1 },
    ];

    const manyRecords = [
        { id: 1, name: 'Prueba rel complex 1' },
    ];

    // Act
    const outputData = remap(DbEntity, mainRecords, {
        sources: [
            { alias: 'many1', type: ManyRelationEntity, records: manyRecords }
        ]
    });

    // Assert
    expect(outputData).toHaveLength(1);
    expect(outputData[0]).toBeInstanceOf(DbEntity);
    expect(outputData[0].id).toEqual(1);
    expect(outputData[0].name).toEqual('test 1');
    expect(outputData[0].relationId).toEqual(1);
    expect(outputData[0].relation).toBeInstanceOf(ManyRelationEntity);
    expect(outputData[0].relation.id).toEqual(1);
    expect(outputData[0].relation.name).toEqual('Prueba rel complex 1');
});

test('Remap source with one to many decorators', () => {
    // Arrange
    class ManyRelationEntity {
        @Column() id: number;
        @Column() name: string;
        @Column() dbEntityId: number;
    }

    class DbEntity {
        @Column() id: number;
        @Column() name: string;
        @OneToMany(ManyRelationEntity, { property: 'id', inverseProperty: 'dbEntityId' })
        relationsMany: ManyRelationEntity[];
    }

    const mainRecords = [
        { id: 1, name: 'test 1' },
        { id: 2, name: 'test 2' }
    ];

    const manyRecords = [
        { id: 1, dbEntityId: 1, name: 'Test rel complex 1' },
        { id: 2, dbEntityId: 2, name: 'Test rel complex 2' }
    ];

    // Act
    const outputData = remap(DbEntity, mainRecords, {
        sources: [
            { type: ManyRelationEntity, records: manyRecords }
        ]
    });

    // Assert
    expect(outputData).toHaveLength(2);

    expect(outputData[0]).toBeInstanceOf(DbEntity);
    expect(outputData[0].id).toEqual(1);
    expect(outputData[0].name).toEqual('test 1');
    expect(outputData[0].relationsMany).toHaveLength(1);
    expect(outputData[0].relationsMany[0]).toBeInstanceOf(ManyRelationEntity);
    expect(outputData[0].relationsMany[0].id).toEqual(1);
    expect(outputData[0].relationsMany[0].name).toEqual('Test rel complex 1');
    expect(outputData[0].relationsMany[0].dbEntityId).toEqual(1);

    expect(outputData[1]).toBeInstanceOf(DbEntity);
    expect(outputData[1].id).toEqual(2);
    expect(outputData[1].name).toEqual('test 2');
    expect(outputData[1].relationsMany).toHaveLength(1);
    expect(outputData[1].relationsMany[0]).toBeInstanceOf(ManyRelationEntity);
    expect(outputData[1].relationsMany[0].id).toEqual(2);
    expect(outputData[1].relationsMany[0].name).toEqual('Test rel complex 2');
    expect(outputData[1].relationsMany[0].dbEntityId).toEqual(2);
});

test('Remap source with one to many decorators and alias', () => {
    // Arrange
    class ManyRelationEntity {
        @Column() id: number;
        @Column() name: string;
        @Column() dbEntityId: number;
    }

    class DbEntity {
        @Column() id: number;
        @Column() name: string;
        @OneToMany('many1', { property: 'id', inverseProperty: 'dbEntityId' })
        relationsMany: ManyRelationEntity[];
    }

    const mainRecords = [
        { id: 1, name: 'test 1' },
    ];

    const manyRecords = [
        { id: 1, dbEntityId: 1, name: 'Test rel complex 1' },
    ];

    // Act
    const outputData = remap(DbEntity, mainRecords, {
        sources: [
            { alias: 'many1', type: ManyRelationEntity, records: manyRecords }
        ]
    });

    // Assert
    expect(outputData).toHaveLength(1);

    expect(outputData[0]).toBeInstanceOf(DbEntity);
    expect(outputData[0].id).toEqual(1);
    expect(outputData[0].name).toEqual('test 1');
    expect(outputData[0].relationsMany).toHaveLength(1);
    expect(outputData[0].relationsMany[0]).toBeInstanceOf(ManyRelationEntity);
    expect(outputData[0].relationsMany[0].id).toEqual(1);
    expect(outputData[0].relationsMany[0].name).toEqual('Test rel complex 1');
    expect(outputData[0].relationsMany[0].dbEntityId).toEqual(1);
});
