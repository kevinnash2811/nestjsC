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
    date:           Date;
    start_date:     string;
    end_date:       string;
    operator:       string;
    latlng:         boolean;
    statusEntrega:  string;
    easyFilter:     string;
    zona_venta_c:   any[];
    category:       string;
    category2:      string;
    campaign:       string;
    customerGroup:  string;
    exclude:        string;
    planificacion:  string;
    includes:       string;
}

export interface Date {
    from:     string;
    to:       string;
}

export interface AccountLatLng {
    id:       string;
    name:     string;
    address:  string;
    location: string;
    category: string;
}

export interface ExcelEntregas {
    rows:      Row[];
    productos: Producto[];
}

export interface Producto {
    name:       string;
    cantidad:   number;
    material:   number;
    garticulos: number;
}

export interface Row {
    index:             number;
    accName:           string;
    accCode:           string;
    UssName:           string;
    UssNamed:          string;
    vendorId:          string;
    jjwg_maps_lat_c:   number;
    jjwg_maps_lng_c:   number;
    zona_transporte_c: string;
    productos:         Producto[];
    code:              string;
    fechaEntrega:      Date;
    entrega:           string;
    calle:             string;
    orgvt:             string;
    ofvt:              string;
    factura:           string;
    material:          string;
    pos:               string;
    sector:            string;
    npedido:           string;
    nfiscal:           string;
    condpago:          string;
    creado:            string;
    clase:             string;
    horaentrega:       string;
    telefono:          string;
    grupo:             string;
    ntransporte:       string;
    cdistribucion:     string;
    denom:             string;
    garticulos:        string;
    cantidad:          string;
    unmedida:          string;
    contador:          string;
    umedida:           string;
    denominacion:      string;
}

export interface datosEntregasCompletasItem {
    index:                 number;
    accName:               string;
    accCode:               string;
    UssName:               string;
    UssNamed:              string;
    vendorId:              string;
    jjwg_maps_lat_c:       string;
    jjwg_maps_lng_c:       string;
    zona_transporte_c:     string;
    productos:             Producto[];
    code:                  string;
    fechaEntrega:          Date;
    entrega:               string;
    calle:                 string;
    orgvt:                 string;
    ofvt:                  string;
    factura:               string;
    material:              string;
    pos:                   string;
    sector:                string;
    npedido:               string;
    nfiscal:               string;
    condpago:              string;
    creado:                string;
    clase:                 string;
    horaentrega:           string;
    telefono:              string;
    grupo:                 string;
    ntransporte:           string;
    cdistribucion:         string;
    denom:                 string;
    garticulos:            string;
    cantidad:              string;
    unmedida:              string;
    contador:              string;
    umedida:               string;
    denominacion:          string;
    id:                    string;
    name:                  string;
    date_entered:          Date;
    date_modified:         Date;
    modified_user_id:      string;
    created_by:            string;
    description:           null;
    deleted:               boolean;
    assigned_user_id:      string;
    iddivision_c:          string;
    idamercado_c:          string;
    fecha_entrega_c:       Date;
    regional_c:            string;
    grupo_cliente_c:       null;
    estado_c:              string;
    ubicacion_c:           string;
    placa_c:               null;
    lugar_entrega_c:       string;
    referencia_c:          string;
    opportunity_id_c:      string;
    articulos_json_c:      null;
    unidades_entregadas_c: string;
    estado_verificacion_c: string;
    id_tenant:             string;
    condicion_pago_c:      string;
    nro_factura_c:         string;
    motivonoentrega_c:     null;
    parent_type:           string;
    parent_id:             string;
    referencia2_c:         string;
}