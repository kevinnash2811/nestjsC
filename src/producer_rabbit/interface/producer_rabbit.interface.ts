export enum TypesPlanning {
    DISTRIBUCION = 'DISTRIBUCION',
    VISITA = 'VISITA',
    TAREAS = 'TAREAS',
    PRUEBA = 'PRUEBA',
}

export interface Body {
  idPlanificacion: string;
  typePlanning: TypesPlanning;
}