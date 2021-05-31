import { Module } from '@nestjs/common';
import { EmailController } from './app.controller';
import { EmailService } from './app.service';

@Module({
  imports: [],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
