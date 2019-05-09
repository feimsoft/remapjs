import { Column, ManyToOne, OneToMany } from "./decorators";
import { remap } from "./remap";

class ManyRelationEntity {
    @Column({ name: 'id' }) id: number;
    @Column({ name: 'nombre' }) name: string;
    @Column() dbId: number;
}

class RelDbEntity {
    @Column({ name: 'id' }) id: number;
    @Column({ name: 'nombre' }) name: string;
}

class DbEntity {
    @Column({ name: 'id' }) id: number;
    @Column({ name: 'nombre' }) name: string;
    @Column({ name: 'relacionId' }) relationId: string;

    @ManyToOne(RelDbEntity, { property: 'relationId', matchProperty: 'id' })
    relation: RelDbEntity;

    @OneToMany(ManyRelationEntity, { property: 'id', inverseProperty: 'dbId' })
    relationsMany: ManyRelationEntity[];
}

const rawData = [{
    id: 0,
    nombre: 'test',
    relacionId: 1,
}, {
    id: 1,
    nombre: 'test 2',
    relacionId: 0,
}];

const outputData = remap(DbEntity, rawData, {
    sources: [
        { type: RelDbEntity, records: [{ id: 0, nombre: 'Prueba rel 1' }, { id: 1, nombre: 'Prueba rel 2' }] },
        { type: ManyRelationEntity, records: [{ id: 0, dbId: 1, nombre: 'Prueba rel complex 1' }, { id: 3, dbId: 0, nombre: 'Prueba rel complex 3' }] }
    ]
});

console.dir(outputData[0]);
console.dir(outputData[1]);