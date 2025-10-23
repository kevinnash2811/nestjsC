import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccountsGetService } from '../service';

@ApiBearerAuth()
@ApiTags('Cuentas')
@Controller('accounts')
export class AccountsGetController {
  constructor(private readonly accountsGetService: AccountsGetService) {}

  /**
   * 
   * @param iduser id del usuario
   * @returns returna todas las lat y lng de todos las cuentas si se pasa el ID del usuario retornara solo las cuentas de dicho usuario.
   */
  @Get('all-accounts-latlng')
  @ApiOperation({ summary: 'Obtener todas las cuentas con su lat y lng del usuario o en general' })
  @ApiQuery({
    name: 'iduser',
    type: 'string',
    required: false,
    description: 'ID del usuario para obtener sus cuentas, puede estar vacio para traer todas las cuentas que tengan lat y lng',
    example: 'e53d41d6-3f4f-2cfc-198a-555f644444ba92d4457',
  })
  allAccountsUser(@Query('iduser') iduser: string){
    return this.accountsGetService.listAccountsUser(iduser)
  }

  /**
   * 
   * @param idaccount id de una cuenta, obtendra el detalle de la cuenta 
   * @returns 
   */
  @Get('account-get-id')
  @ApiOperation({ summary: 'Obtiene la información detallada de una cuenta' })
  @ApiQuery({
    name: 'idaccount',
    type: 'string',
    required: false,
    description: 'ID de la cuenta para obtener la información detallada',
    example: '01010FA5-F21A-44A9-A71C-E5C67783EED8',
  })
  accountGetAll(@Query('idaccount') idaccount: string){
    return this.accountsGetService.accountGetAll(idaccount)
  }
 
  @Get('account-contacts')
  @ApiOperation({ summary: 'Obtiene los contactos de una cuenta por su ID' })
  @ApiQuery({
    name: 'idaccount',
    type: 'string',
    required: true,
    description: 'Id de la cuenta',
    example: '01010FA5-F21A-44A9-A71C-E5C67783EED8'
  })
  contactsByAccountId(@Query('idaccount') idaccount: string){
    return this.accountsGetService.getAccountContacts(idaccount);
  }

  @Get('contact-accounts')
  @ApiOperation({ summary: 'Obtiene las cuentas de un contacto por su ID' })
  @ApiQuery({
    name: 'contactid',
    type: 'string',
    required: true,
    description: 'Id del contacto',
    example: '01010FA5-F21A-44A9-A71C-E5C67783EED8'
  })
  accountsByContactId(@Query('contactid') contactid: string){
    return this.accountsGetService.getContactAccounts(contactid);
  }
}

