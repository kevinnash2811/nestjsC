import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Post, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Correos')
@Controller('mailer')
export class MailerPostController {
  constructor(
    @Inject(MailerService)
    private readonly mailerService: MailerService,
  ) {}

  @Post('sendMail')
  @ApiOperation({ summary: 'Enviar correo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        to: { type: 'string' },
        subject: { type: 'string' },
        html: { type: 'string' },
        cc: { type: 'string' },
      },
    },
    required: true,
  })
  async create(@Body() sendMailOptions: ISendMailOptions) {
    await this.mailerService.sendMail(sendMailOptions);
  }
}
