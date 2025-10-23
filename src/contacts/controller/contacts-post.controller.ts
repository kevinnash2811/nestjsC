import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContactFilterDto } from '../dto';
import { ContactsService } from '../service';

@ApiTags('Contactos')
@Controller('contacts')
export class ContactsPostController {
  constructor(private readonly contactsrv: ContactsService) {}

  @Post('/with-accounts')
  @ApiOperation({ summary: 'Contact list with accounts' })
  @ApiResponse({
    status: 200,
    description: 'Object with the response',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'array', items: { type: 'ContactWithAccounts' } },
        totalRecords: { type: 'number', example: 34 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async listContactByAccounts(@Body() filter: ContactFilterDto): 
    Promise<{success: boolean, data: Array<any>, totalRecords: number }> {
    const [ result, resRecords ] = await Promise.all([
      this.contactsrv.filterList(filter),
      this.contactsrv.filterListTotal(filter),
    ])

    return { success: true, data: result, totalRecords: resRecords }
  }
}
