import { Logger, Module } from '@nestjs/common';
import { MailerPostController } from './controller/mailer-post.controller';
import { MailerService, MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration } from 'src/config/nacos.config';

@Module({
  controllers: [MailerPostController],
  providers: [],
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        Logger.debug(`${config.get<string>('MAIL_HOST')}`, 'MAILER');
        Logger.debug(`${config.get<string>('MAIL_PORT')}`, 'MAILER');
        Logger.debug(`${config.get<string>('MAIL_SECURE')}`, 'MAILER');
        Logger.debug(`${config.get<boolean>('MAIL_IGNORE_TLS')}`, 'MAILER');
        Logger.debug(`${config.get<boolean>('MAIL_SECURE')}`, 'MAILER');
        Logger.debug(`${config.get<string>('MAIL_USER')}`, 'MAILER');
        Logger.debug(`${config.get<string>('MAIL_PASSWORD')}`, 'MAILER');

        return {
          transport: {
            host: config.get('MAIL_HOST'),
            port: config.get('MAIL_PORT'),
            secure: eval(config.get('MAIL_SECURE')),
            ignoreTLS: eval(config.get('MAIL_IGNORE_TLS')),
            auth: eval(config.get('MAIL_SECURE'))
              ? {
                  user: config.get('MAIL_USER'),
                  pass: config.get('MAIL_PASSWORD'),
                }
              : undefined,
          },
          defaults: {
            from: config.get('MAIL_FROM'),
          },
          options: {},
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MailModule {}
