export interface UserCRM {
    id:                    string;
    nombres:               string;
    apellidos:             string;
    iddivision:            string;
    division:              string;
    idamercado:            string;
    amercado:              string;
    idregional:            string;
    regional:              string;
    rol:                   string;
    rol_hbm_c:             string;
    estado:                string;
    activo:                string;
    codigo_empleado:       string;
    codigo_vendedor:       string;
    email:                 string;
    id_reponsable:         string;
    nombres_responsable:   string;
    apellidos_responsable: string;
    pais:                  string;
    idgrupocliente:        string;
    idlocation:            string;
    namelocation:          string;
    is_admin:              boolean;
    idempresa:             string;
    almacen_id:            string|null;
    almacen_name:          string|null;
    reports_to_id:         ReportsToId[];
    reports_id:            string[];
    avatar:                string | null;
    zona_ventas_c:         ListSaleZone[];
    ciclos:                string;
}

export interface ListSaleZone {
    ID:         string;
    Value:      string;
    ListType:   string;
    ListId:     string;
}

export interface Filter {
    easyFilter:   string;
    reports_to_id:   string;
    iddivision_c:   string;
    idregional_c:   string;
    idamercado_c:   string;
    }
export interface ReportsToId {
    id:               string| null;
    user_name:        string| null;
    division:         string| null;
    a_mercado:        string| null;
    avatar:           string| null;
    employee_status:  string| null;
    cargo:            string| null;
    iddivision_c:     string| null;
    idamercado_c:     string| null;
    idgrupocliente_c: string| null;
    idregional_c:     string| null;
    idvendedor_c:     string| null;
    email:            string| null;
}