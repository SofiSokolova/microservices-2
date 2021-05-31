import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { EmailService } from './app.service';

@Controller()
export class EmailController {
  constructor(private emailService: EmailService) {}

  @EventPattern('message_printed')
  async handleMessagePrinted(data: Record<string, unknown>) {
    console.log(data.text);
  }

  // @EventPattern('user_created')
  /*  @MessagePattern('user_created')
  async handleUserCreated(data: Record<string, string>) {
    console.log('im in ms controller now');
    await this.emailService.sendInfoUserCreated(
      data.userEmail,
      data.confirmToken,
    );
    return console.log(`i'll send email i promise(no)`);
  }*/
}
