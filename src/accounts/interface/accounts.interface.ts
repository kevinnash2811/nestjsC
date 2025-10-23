export interface BodyFilterAdvancer {
    page:        number;
    rowsPerPage: number;
    filter:      Filter;
    sortBy:      string;
    order:       string;
}

export interface Filter {
    name:           string;
    lastname:       string;
    comercial_name: string;
    client_type:    string;
    account_type:   string;
    aio_code:       string;
    nit_ci:         string;
    cellphone:      string;
    category:       string;
    email:          string;
    industry:       string;
    sub_industry:   string;
    country:        string;
    state:          string;
    city:           string;
    street:         string;
    document_type:  string;
    tax_regime:     string;
    website:        string;
    created_by:     any[];
    modified_by:    any[];
    assigned_to:    any[];
    creation_date:  CreationDate;
    latlng:         boolean;
    easyFilter:     string;
    zona_venta_c:   string[],
    category2:      string,
    exclude:        string;
    customerGroup:  string;
    planificacion:  string;
    includes:       string;
    ruleDate:       string;
    idsToInclude:   string[];
    idsToExclude:   string[];
}

export interface CreationDate {
    from:     string;
    to:       string;
    operator: string;
    option:   string;
}


export interface AccountLatLng {
    id:       string;
    name:     string;
    address:  string;
    location: string;
    category: string;
}
export interface Account{ 
    id: string;
    nombre: string;
    comercial_name: string;
    deleted: Number;
    account_type: string;
    nit: string;
    codigo?: string;
    tipo?: string;
    customerRegion?: string;
  }

export interface AccountRawPlanning {
    ruta_id: string;
    id: string;
    account_name: string | null;
    billing_address_city: string | null;
    billing_address_street: string | null;
    categoria_ventas_c: string | null;
    categoria_ventas02_c: string | null;
    jjwg_maps_lat_c: string | null;
    jjwg_maps_lng_c: string | null;
    zona_transporte_c: string | null;
    zone: string | null;
    zoneId: string | null;
}
