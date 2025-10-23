export interface DataHanrtPlanificador {
    hanrtPlanificadorData: HanrtPlanificadorData;
    idVehiculosList:       string[];
    relacionesList:        RelacionesList[];
    rutasEntregasList:     RutasEntregasList[];
}

export interface HanrtPlanificadorData {
    name:                 string;
    userId:               string;
    description:          string;
    tipo:                 string;
    iddivisionC:          string;
    idamercadoC:          string;
    regionC:              string;
    canalC:              string;
    estadoPlanificacionC: string;
    fechaInicioC:         Date;
    fechaFinC:            Date;
}

export interface RelacionesList {
    name:         string;
    userId:       string;
    description:  string;
    tipoRelacion: string;
    principal:    string;
    iddivisionC:  string;
    idamercadoC:  string;
    idregionalC:  string;
}

export interface RutasEntregasList {
    ruta:     RutaIterface;
    entregas: Entregas[];
}

export interface Entregas {
    name:         string;
    description:  string;
    tipoVisitaC:  string;
    fechaInicioC: Date;
    horaInicioC:  Date;
    duracionC:    Date;
    fechaFinC:    Date;
    horaFinC:     Date;
    secuenciaC:   number;
    idAccount:    string;
    userId:       string;
    latitud:      number;
    longitud:     number;
    tareasPlan:   string[];
    entregasList: string[];
}

export interface RutaIterface {
    name:        string;
    description: string;
    fechaPlanC:  Date;
    capacidadC:  string;
    horaInicioC: Date;
    duracionC:   Date;
    horaFinC:    Date;
    secuenciaC:  number;
    bloqueadoC:  string;
    userId:      string;
    idVehiculo:  string;
}
