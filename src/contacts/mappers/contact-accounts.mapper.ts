import { AccountTask, AccountWithTask, ContactWithAccounts, ContactWithAccountsRaw } from "../interface";

// acumula los contactos por ID y dentro de cada contacto pone su cuenta con sus tareas 
export const groupContacts = (acc: Record<string, ContactWithAccounts>, curr: ContactWithAccountsRaw): Record<string, ContactWithAccounts> => {
  const account: AccountWithTask = {
    id: curr.accountId,
    nombre: curr.nombre,
    account_type: curr.account_type,
    tasks: JSON.parse(curr.tasks || '[]') as AccountTask[],
    visitado: curr.visitado,
    pendientes: curr.pendientes,
    addressAccount: curr.addressAccount,
    categoria_ventas02_c: curr.categoria_ventas02_c,
    categoria_ventas_c: curr.categoria_ventas_c,
    cityAccount: curr.cityAccount,
    comercial_name: curr.comercial_name,
    countryAccount: curr.countryAccount,
    client_group: curr.client_group,
    nit: curr.nit,
    zona_ventas_c: curr.zona_ventas_c,
  };
  
  const accounts = acc[curr.id] !== undefined ? [...acc[curr.id].accounts, account] : [account];
  acc[curr.id] = {
    id: curr.id,
    first_name: curr.first_name,
    last_name: curr.last_name,
    salutation: curr.salutation,
    title: curr.title ?? 'Sin cargo',
    phone_mobile: curr.phone_mobile,
    especialidad: curr.especialidad ?? 'Sin especialidad',
    clasificacion: curr.clasificacion,
    cantidadVisitas: curr.cantidadVisitas,
    accounts: accounts,
    address_street: curr.address_street,
    ci: curr.ci,
    city: curr.city,
    phone_home: curr.phone_home,
    phone_work: curr.phone_work,
    photo: curr.photo,
  }
  return acc;
}