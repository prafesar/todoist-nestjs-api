import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { createTestAccount, createTransport } from 'nodemailer';
import { config } from 'dotenv';

import { CreateLetterDto } from './dto/create-letter.dto';

config()

@Injectable()
export class NotifyService {
  constructor(private readonly mailerService: MailerService) {}
  
  sendLetter(letter: CreateLetterDto) {
    const { to, subject = "You mentioned in comment", text } = letter;
    const from: string = process.env.NOTIFY_EMAIL;
    return this.mailerService.sendMail({ to, from, subject, text })
  }

  async sendTestLetter(letter: CreateLetterDto) {
    const { to, subject, text } = letter;
    
    let testEmailAccount = await createTestAccount();
  
    let transporter = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testEmailAccount.user,
        pass: testEmailAccount.pass,
      },
    })
    
    return await transporter.sendMail({ to, subject, text });
  }

}
