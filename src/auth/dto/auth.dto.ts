import { ApiProperty } from '@nestjs/swagger';

export interface JwtPayload {
  email: string;
  role: string;
}

export class signInDTO {
  @ApiProperty({
    description: 'User email address',
    example: 'mostafijurrahman163@gmail.com',
  })
  email: string;
  @ApiProperty({
    description: 'User password',
    example: '38i4uns&*#J',
  })
  password: string;
}
