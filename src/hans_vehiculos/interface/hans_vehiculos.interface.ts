export interface BodyFilterAdvancer {
    page:        number;
    rowsPerPage: number;
    filter:      Filter;
    sortBy:      string;
    order:       string;
}

export interface Filter {
    easyFilter:     string;
    regional:       string;
    state:          string;
    assigned_to:    string[];
}

export interface CreationDate {
    from:     string;
    to:       string;
    operator: string;
    option:   string;
}

export interface Vehiculo {
    id:             string;
    placa:          string;
    chasis:         string;
    amercado:       string;
    amercado_label: string;
    division:       string;
    division_label: string;
    capacidad_1_c:  string | null;
    capacidad_2_c:  string | null;
    capacidad_3_c:  string | null;
    capacidad_4_c:  string | null;
    first_name:     string;
    last_name:      string;
    tipo_c:         string;
    tipo_label:     string;
}

export interface VehiculoRaw {
  id: string;
  name: string;
  amercado_c: string | null;
  amercado_label_c: string | null;
  iddivision_c: string;
  division_label_c: string;
  regional_c: string;
  regional_label_c: string;
  capacidad_1_c: string;
  tipo_auto_c: string;
  estado_vehiculo_c: string;
  estado_vehiculo_label: string;
  conductores: string; // JSON string con array de conductores
}

export interface ConductorRaw {
  name: string;
  user_id: string;
  tipo_c: string;
  tipo_c_label: string;
  user_iddivision_c: string;
  user_division_c: string;
  user_idamercado_c: string;
  user_amercado_c: string;
  user_idregional_c: string;
  user_regional_c: string;
  user_name: string;
}