export interface hanr_planificador {
    id:                     string;
    name:                   string;
    date_entered:           Date;
    date_modified:          Date;
    modified_user_id:       string;
    created_by:             string;
    description:            string;
    deleted:                number;
    id_tenant:              string;
    assigned_user_id:       string;
    tipo:                   string;
    iddivision_c:           string;
    idamercado_c:           string;
    region_c:               string;
    estado_planificacion_c: string;
    fecha_inicio_c:         Date;
    fecha_fin_c:            Date;
}
