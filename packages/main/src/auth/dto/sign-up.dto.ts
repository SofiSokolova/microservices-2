import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../core/decorators/match-field.validation.decorator';
import { UserCreateDto } from '../../user/dto/user-create.dto';

export class SignUpDto extends UserCreateDto {
  @ApiProperty()
  @Match('password')
  confirmPassword: string;
}
