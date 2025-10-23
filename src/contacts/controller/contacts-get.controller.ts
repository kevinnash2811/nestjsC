import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ContactsService } from "../service";
import { ContactFilterDto } from "../dto";

@ApiTags('Contactos')
@Controller('contacts')
export class ContactsGetController {
  constructor(private readonly contactsrv: ContactsService) { }

  @Get('list-with-accounts')
  @ApiOperation({ summary: 'Obtener la lista de contactor paginadas y filtradas por busqueda, con cuentas asociadas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contactos paginadas y filtradas con cuentas asociadas',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'array', items: { type: 'object' } },
        totalRecords: { type: 'number' }
      }
    }
  })
  async getFilterList(@Query() q: ContactFilterDto) {
    const result = await this.contactsrv.filterList(q);
    const resRecords = await this.contactsrv.filterListTotal(q);

    return { success: true, data: result, totalRecords: resRecords };
  }

}
