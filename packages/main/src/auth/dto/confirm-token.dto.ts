import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmTokenDto {
  @ApiProperty({
    description: 'The confirmEmail token hash of the User',
  })
  @IsNotEmpty()
  @IsString()
  readonly confirmToken: string;
}
