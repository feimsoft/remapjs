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


test('Remap one to many ignoring case', () => {
    // Arrange
    class ConceptoContenidoRO {
        @Column()
        public idConcepto: number;
        @Column()
        public idioma: string;
        @Column()
        public nombre: string;
    }

    class ConceptoTarifaRO {
        @Column()
        ejercicio: number;
        @Column()
        precioUnitario: number;
        @Column()
        formula: string;
    }


    class ConceptoRO {
        @Column()
        idConcepto: number;

        @Column()
        codigoConceptoOrdenanza: string;

        @OneToMany(ConceptoContenidoRO, { inverseProperty: 'idConcepto', property: 'idConcepto' })
        contenidos: ConceptoContenidoRO[];

        @ManyToOne(ConceptoTarifaRO)
        tarifa: ConceptoTarifaRO;
    }

    const mainRecords = [{ "IdConcepto": 6040, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 36 }, { "IdConcepto": 6041, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 28 }, { "IdConcepto": 6042, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 21 }, { "IdConcepto": 6043, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 13 }, { "IdConcepto": 6044, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 35 }, { "IdConcepto": 6045, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 18 }, { "IdConcepto": 6046, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 5 }, { "IdConcepto": 6047, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 120 }, { "IdConcepto": 6048, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 15 }, { "IdConcepto": 6049, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": "53,71+([93]-1)*[PrecioUnitario]", "tarifa.precioUnitario": 5 }, { "IdConcepto": 6050, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 4 }, { "IdConcepto": 6051, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 11 }, { "IdConcepto": 6052, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 9 }, { "IdConcepto": 6053, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 6 }, { "IdConcepto": 6054, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 4 }, { "IdConcepto": 6055, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 10 }, { "IdConcepto": 6056, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 5 }, { "IdConcepto": 6057, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 4 }, { "IdConcepto": 6058, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 22 }, { "IdConcepto": 6059, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 13 }, { "IdConcepto": 6060, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 128 }, { "IdConcepto": 6061, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 103 }, { "IdConcepto": 6062, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 45 }, { "IdConcepto": 6063, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 27 }, { "IdConcepto": 6064, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 14 }, { "IdConcepto": 6065, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 9 }, { "IdConcepto": 6066, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 14 }, { "IdConcepto": 6067, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 22 }, { "IdConcepto": 6068, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 6 }, { "IdConcepto": 6069, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 1 }, { "IdConcepto": 6070, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 5 }, { "IdConcepto": 6071, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 14 }, { "IdConcepto": 6072, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": "55,05+([93]-1)*[PrecioUnitario]", "tarifa.precioUnitario": 6 }, { "IdConcepto": 6073, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": null, "tarifa.precioUnitario": 46 }, { "IdConcepto": 6074, "CodigoConceptoOrdenanza": null, "tarifa.ejercicio": 2019, "tarifa.formula": "[94]", "tarifa.precioUnitario": 1 }];
    const manyRecords = [{ "IdConcepto": 6040, "Idioma": "es", "Nombre": "Insp. periòdicca veh. pesants" }, { "IdConcepto": 6040, "Idioma": "ca", "Nombre": "Insp. periòdicca veh. pesants" }, { "IdConcepto": 6041, "Idioma": "es", "Nombre": "Insp. periòdica veh. lleugers" }, { "IdConcepto": 6041, "Idioma": "ca", "Nombre": "Insp. periòdica veh. lleugers" }, { "IdConcepto": 6042, "Idioma": "es", "Nombre": "Insp. periòdica quadricicles, quads i turismes" }, { "IdConcepto": 6042, "Idioma": "ca", "Nombre": "Insp. periòdica quadricicles, quads i turismes" }, { "IdConcepto": 6043, "Idioma": "es", "Nombre": "Insp. periòdica vehicles 2 i 3 rodes" }, { "IdConcepto": 6043, "Idioma": "ca", "Nombre": "Insp. periòdica vehicles 2 i 3 rodes" }, { "IdConcepto": 6044, "Idioma": "es", "Nombre": "Insp. emissió gasos veh. pesants diesel" }, { "IdConcepto": 6044, "Idioma": "ca", "Nombre": "Insp. emissió gasos veh. pesants diesel" }, { "IdConcepto": 6045, "Idioma": "es", "Nombre": "Insp. emissió gasos veh. lleugers i turismes diesel" }, { "IdConcepto": 6045, "Idioma": "ca", "Nombre": "Insp. emissió gasos veh. lleugers i turismes diesel" }, { "IdConcepto": 6046, "Idioma": "es", "Nombre": "Insp. emissió gasos veh. amb catalizador" }, { "IdConcepto": 6046, "Idioma": "ca", "Nombre": "Insp. emissió gasos veh. amb catalizador" }, { "IdConcepto": 6047, "Idioma": "es", "Nombre": "Insp. emissió gasos veh. accidentats amb insp. periòdica" }, { "IdConcepto": 6047, "Idioma": "ca", "Nombre": "Insp. emissió gasos veh. accidentats amb insp. periòdica" }, { "IdConcepto": 6048, "Idioma": "es", "Nombre": "Suplment per insp. a estació m`bol" }, { "IdConcepto": 6048, "Idioma": "ca", "Nombre": "Suplment per insp. a estació m`bol" }, { "IdConcepto": 6049, "Idioma": "es", "Nombre": "Desplaçament" }, { "IdConcepto": 6049, "Idioma": "ca", "Nombre": "Desplaçament" }, { "IdConcepto": 6050, "Idioma": "es", "Nombre": "Pesatge" }, { "IdConcepto": 6050, "Idioma": "ca", "Nombre": "Pesatge" }, { "IdConcepto": 6051, "Idioma": "es", "Nombre": "Segona insp. pesants" }, { "IdConcepto": 6051, "Idioma": "ca", "Nombre": "Segona insp. pesants" }, { "IdConcepto": 6052, "Idioma": "es", "Nombre": "Segona insp. lleugers" }, { "IdConcepto": 6052, "Idioma": "ca", "Nombre": "Segona insp. lleugers" }, { "IdConcepto": 6053, "Idioma": "es", "Nombre": "Segona insp. turismes" }, { "IdConcepto": 6053, "Idioma": "ca", "Nombre": "Segona insp. turismes" }, { "IdConcepto": 6054, "Idioma": "es", "Nombre": "Segona insp. motocicletes" }, { "IdConcepto": 6054, "Idioma": "ca", "Nombre": "Segona insp. motocicletes" }, { "IdConcepto": 6055, "Idioma": "es", "Nombre": "Segona insp. emissió gasos veh. pesants diesel" }, { "IdConcepto": 6055, "Idioma": "ca", "Nombre": "Segona insp. emissió gasos veh. pesants diesel" }, { "IdConcepto": 6056, "Idioma": "es", "Nombre": "Segona insp. emissió gasos veh. lleugers i turismes diesel" }, { "IdConcepto": 6056, "Idioma": "ca", "Nombre": "Segona insp. emissió gasos veh. lleugers i turismes diesel" }, { "IdConcepto": 6057, "Idioma": "es", "Nombre": "Emissió de duplicat de fulla insp. o adhesiu " }, { "IdConcepto": 6057, "Idioma": "ca", "Nombre": "Emissió de duplicat de fulla insp. o adhesiu" }, { "IdConcepto": 6058, "Idioma": "es", "Nombre": "Isnp. periòdica tractors agrícoles" }, { "IdConcepto": 6058, "Idioma": "ca", "Nombre": "Isnp. periòdica tractors agrícoles" }, { "IdConcepto": 6059, "Idioma": "es", "Nombre": "Isnp. periòdica remolcs agrícoles" }, { "IdConcepto": 6059, "Idioma": "ca", "Nombre": "Isnp. periòdica remolcs agrícoles" }, { "IdConcepto": 6060, "Idioma": "es", "Nombre": "Insp. prèvia a matriculació veh. transit com.o importació" }, { "IdConcepto": 6060, "Idioma": "ca", "Nombre": "Insp. prèvia a matriculació veh. transit com.o importació" }, { "IdConcepto": 6061, "Idioma": "es", "Nombre": "Insp. prèvia a matriculació veh. exempts e històrics" }, { "IdConcepto": 6061, "Idioma": "ca", "Nombre": "Insp. prèvia a matriculació veh. exempts e històrics" }, { "IdConcepto": 6062, "Idioma": "es", "Nombre": "Insp. prèvia a matriculació veh. importats per rep. oficial i canvi de matrícula" }, { "IdConcepto": 6062, "Idioma": "ca", "Nombre": "Insp. prèvia a matriculació veh. importats per rep. oficial i canvi de matrícula" }, { "IdConcepto": 6063, "Idioma": "es", "Nombre": "Reformes importants amb proyecte" }, { "IdConcepto": 6063, "Idioma": "ca", "Nombre": "Reformes importants amb proyecte" }, { "IdConcepto": 6064, "Idioma": "es", "Nombre": "Reformes importants sense proyecte" }, { "IdConcepto": 6064, "Idioma": "ca", "Nombre": "Reformes importants sense proyecte" }, { "IdConcepto": 6065, "Idioma": "es", "Nombre": "Duplicats de tarjeta ITV" }, { "IdConcepto": 6065, "Idioma": "ca", "Nombre": "Duplicats de tarjeta ITV" }, { "IdConcepto": 6066, "Idioma": "es", "Nombre": "Verificació i precintatge aparells taxímetres" }, { "IdConcepto": 6066, "Idioma": "ca", "Nombre": "Verificació i precintatge aparells taxímetres" }, { "IdConcepto": 6067, "Idioma": "es", "Nombre": "Inspecció veh. transports escolars i de menors" }, { "IdConcepto": 6067, "Idioma": "ca", "Nombre": "Inspecció veh. transports escolars i de menors" }, { "IdConcepto": 6068, "Idioma": "es", "Nombre": "Anotació tarjeta ITV" }, { "IdConcepto": 6068, "Idioma": "ca", "Nombre": "Anotació tarjeta ITV" }, { "IdConcepto": 6069, "Idioma": "es", "Nombre": "Carpeta i impresos" }, { "IdConcepto": 6069, "Idioma": "ca", "Nombre": "Carpeta i impresos" }, { "IdConcepto": 6070, "Idioma": "es", "Nombre": "Emissió certif. sense inspecció prèvia" }, { "IdConcepto": 6070, "Idioma": "ca", "Nombre": "Emissió certif. sense inspecció prèvia" }, { "IdConcepto": 6071, "Idioma": "es", "Nombre": "Emissió certif. amb inspecció prèvia" }, { "IdConcepto": 6071, "Idioma": "ca", "Nombre": "Emissió certif. amb inspecció prèvia" }, { "IdConcepto": 6072, "Idioma": "es", "Nombre": "Desplaçament per insp.veh. agrícoles" }, { "IdConcepto": 6072, "Idioma": "ca", "Nombre": "Desplaçament per insp.veh. agrícoles" }, { "IdConcepto": 6073, "Idioma": "es", "Nombre": "Certificat ATP" }, { "IdConcepto": 6073, "Idioma": "ca", "Nombre": "Certificat ATP" }, { "IdConcepto": 6074, "Idioma": "es", "Nombre": "Altres" }, { "IdConcepto": 6074, "Idioma": "ca", "Nombre": "Altres" }]

    // Act
    const outputData = remap(ConceptoRO, mainRecords, {
        ignoreCase: true,
        sources: [
            { type: ConceptoContenidoRO, records: manyRecords },
        ]
    });

    // Assert
    expect(outputData).toHaveLength(35);
    outputData.forEach(x => expect(x).toBeInstanceOf(ConceptoRO));
});


test('Remap many to one set null when all property at null', () => {
    // Arrange
    class EntityB {
        @Column()
        value1: string;

        @Column()
        value2: string;
    }


    class EntityA {

        @Column()
        label: string;

        @ManyToOne(EntityB)
        project: EntityB;
    }

    const mainRecords = [{ label: 'test', 'project.value1': null, 'project.value2': null }];

    // Act
    const outputData = remap(EntityA, mainRecords);

    // Assert
    expect(outputData).toHaveLength(1);
    expect(outputData[0]).toBeInstanceOf(EntityA);
    expect(outputData[0].label).toEqual('test');
    expect(outputData[0].project).toBeNull();
});
