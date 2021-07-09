import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { createTestAccount, createTransport } from 'nodemailer';
import { config } from 'dotenv';

import { CreateLetterDto } from './dto/create-letter.dto';
import { Letter } from './letter.model';

config()

@Injectable()
export class NotifyService {
  constructor(private readonly mailerService: MailerService) {}
  
  sendRealLetter(letter: Letter) {
    const { to, subject, text } = letter;
    const from: string = process.env.NOTIFY_EMAIL;
    this.mailerService.sendMail({ to, from, subject, text })
  }

  async sendLetter(letter: CreateLetterDto) {
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
    
    let result = await transporter.sendMail({ to, subject, text })
    return result;
  }

  createLetter(letterDto: CreateLetterDto): Letter {
    const { to, subject = "You mentioned in comment", text } = letterDto;

    const letter = {
      to,
      from: process.env.NOTIFY_EMAIL,
      subject,
      text,
    };

    return letter;
  }
}
