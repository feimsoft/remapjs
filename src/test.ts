import "reflect-metadata";

import { Column, ManyToOne } from "./index";
import { remap } from "./remap";

export class Desglose {
    @Column({ name: 'Principal' })
    principal: number;
    @Column({ name: 'Recargo' })
    recargo: number;
    @Column({ name: 'Intereses' })
    intereses: number;
    @Column({ name: 'Costas' })
    costas: number;
    @Column({ name: 'Pendiente' })
    pendiente: number;
    @Column({ name: 'Pagado' })
    pagado: number;
}

export class Recibo {
    @Column({ name: 'idRecibo' })
    id: number;

    @Column({ name: 'Nif' })
    nif: string;

    @Column({ name: 'Referencia' })
    referencia: string;

    @Column({ name: 'CodigoMunicipio' })
    codigoMunicipio: string;

    @Column({ name: 'DireccionTributaria' })
    direccionTributaria: string;

    @Column({ name: 'Ejercicio' })
    ejercicio: string;

    @Column({ name: 'Tipo' })
    tipo: string;

    @Column({ name: 'Estado' })
    estado: string;

    @Column({ name: 'Objeto' })
    objeto: string;

    @Column({ name: 'IdConcepto' })
    idConcepto: number;

    @Column({ name: 'FechaInicio' })
    fechaInicio: Date | null;

    @Column({ name: 'FechaFin' })
    fechaFin: Date | null;

    @ManyToOne(Desglose)
    desglose: Desglose;
}

const rawData = [{
    idRecibo: 26166349,
    CodigoMunicipio: '040',
    Ejercicio: 2019,
    Tipo: 'Tributo',
    Estado: '01',
    IdConcepto: 61,
    DireccionTributaria: 'CE GUILLEM MASSOT Nº 0056  Piso 04 Pta. 0C',
    Referencia: '040-19-07-0119672',
    Nif: '43227891N',
    FechaInicio: '2019-03-15T00:00:00.000Z',
    FechaFin: '2019-05-15T00:00:00.000Z',
    Objeto: '8890-DJC       MAZDA MAZDA         ',
    'Desglose.Costas': 0,
    'Desglose.Principal': 143.88,
    'Desglose.Recargo': 0,
    'Desglose.Intereses': 0,
    'Desglose.Pendiente': 143.88,
    'Desglose.Pagado': 0
}
];

const outputData = remap(Recibo, rawData, {
    ignoreCase: true
});

console.dir(outputData);