import { Contact } from "src/contacts/interface";
import { Account } from "./accounts.interface";

export interface AccountWithContactsRaw extends Account{
  contacts: string; // contacto string json desde DB
  tareas_json: string | null;
}

export interface AccountWithContacts extends Account {
  contacts: Contact[];
  tasks: any[];
}