import { Injectable } from "@nestjs/common";
import { ContactsRepository } from "../repository/contacts.repository";
import { ContactFilterDto } from "../dto";
import { groupContacts } from "../mappers/contact-accounts.mapper";
import { ContactWithAccounts } from "../interface";

@Injectable()
export class ContactsService{
  constructor(private readonly contactRepo: ContactsRepository) { }

  async filterList(filters: ContactFilterDto): Promise<ContactWithAccounts[]>{
    const data = await this.contactRepo.listFilters(filters);
    const contacts = data.reduce(groupContacts, {}); 
    return Object.values(contacts);
  }

  filterListTotal(filters: ContactFilterDto): Promise<number> {
    return this.contactRepo.totalListFilters(filters);
  }
}