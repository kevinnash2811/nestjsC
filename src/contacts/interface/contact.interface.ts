
export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  salutation: string;
  title?: string;
  photo: string;
  phone_home: string;
  phone_work: string;
  city: string;
  address_street: string;
  ci: string;
  phone_mobile: string;
  especialidad?: string;
  clasificacion: string;
  cantidadVisitas: string;
}

export interface AccountTask {
  id: string;               
  obligatorio_c: string;
  name: string;             
  description: string;
  estado_c: string;
  estadotarea: string;
  iddivision_c: string;
  division: string;
  idamercado_c: string;
  mercado: string;
  region_c: string;
  region: string;
  tipo_tarea_c: string;
  tipotarea: string;
  tarea_para_c: string;
  tarea_para: string;
  accountId: string;
}

export interface AccountSP {
  accountId: string;
  nombre: string;
  account_type: string;
  cityAccount: string;
  countryAccount: string;
  addressAccount: string;
  zona_ventas_c: string;
  nit: string;
  categoria_ventas_c: string;
  categoria_ventas02_c: string;
  comercial_name: string;
  client_group: string;
  visitado: string;
  pendientes: string;
}

export interface ContactWithAccountsRaw extends Contact, AccountSP{
  tasks: string; // JSON string
}
export interface AccountWithTask extends Omit<AccountSP, 'accountId'> {
  id: string;
  tasks: AccountTask[];
} 
export interface ContactWithAccounts extends Contact {
  accounts: AccountWithTask[];
}

export interface ContactRawPlanning {
  ruta_id: string;
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone_mobile: string | null;
  salutation: string | null;
  title: string | null;
  contactSpeciality: string | null;
  clasificacion_c: string | null;
}

export interface AdvancedFilter{
  name: string;
  phone_mobile: string;
}