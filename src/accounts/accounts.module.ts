import { Module } from '@nestjs/common';
import { AccountsGetController, AccountsPathController, AccountsPostController } from './controller';
import { AccountRepository } from './repository/account.repository';
import { AccountsGetService, AccountsPathService, AccountsPostService } from './service';
@Module({
  controllers: [
    AccountsPostController,
    AccountsGetController,
    AccountsPathController
  ],
  providers: [
    AccountRepository,
    AccountsPostService,
    AccountsGetService,
    AccountsPathService,
  ],
})
export class AccountsModule { }
