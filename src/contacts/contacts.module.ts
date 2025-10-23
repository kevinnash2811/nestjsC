import { Module } from "@nestjs/common";
import { ContactsGetController, ContactsPostController } from "./controller";
import { ContactsRepository } from "./repository/contacts.repository";
import { ContactsService } from "./service/contacts.service";

@Module({
  controllers: [ContactsGetController, ContactsPostController],
  providers: [ContactsRepository, ContactsService]
})
export class ContactsModule { }