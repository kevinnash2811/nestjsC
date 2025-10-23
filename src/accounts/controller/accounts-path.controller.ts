import { Controller, Patch, Param, Body }                          from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountsPathService }                                     from '../service';
import { AccountLatLng }                                           from '../dto'

@ApiBearerAuth()
@ApiTags('Cuentas')
@Controller('accounts')
export class AccountsPathController {
  constructor(private readonly accountsPathService: AccountsPathService) {}

  @Patch(':idAccount')
  @ApiOperation({ summary: 'Actualiza latitud y longitud de la cuenta' })
  @ApiResponse ({ status: 200, description: 'Actualización exitosa' })
  @ApiResponse ({ status: 400, description: 'Actualización fallida' })
  @ApiParam({
    name: 'idAccount',
    type: 'string',
    required: true,
    description: 'ID de la Cuenta',
    example: '7d6534ab-5dfb-b3f8-9712-666af101e161',
  })
  @ApiBody({ 
    description: 'Datos del usuario a actualizar',
    type: AccountLatLng
  })
  updateAccount(@Param('idAccount' ) idAccount: string, @Body() accountLatLng: AccountLatLng ) {
    return this.accountsPathService.updatelatLng(idAccount, accountLatLng);
  }

}
