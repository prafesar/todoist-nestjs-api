import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { config } from 'dotenv';

import { NotifyService } from './notify.service';

config();

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'Gmail',
          auth: {
            user: process.env.NOTIFY_EMAIL,
            pass: process.env.NOTIFY_PASS,
          },
        },
      })
    })
  ],
  providers: [NotifyService],
})
export class NotifyModule {}
