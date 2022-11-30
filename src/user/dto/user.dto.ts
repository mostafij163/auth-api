import {ApiProperty} from "@nestjs/swagger"

export class UserDTO {
  @ApiProperty({
    description: 'User name',
    example: 'mostafijur'
  })
  name: string;
  @ApiProperty({
    description: 'User email address',
    example: 'mostafijurrahman163@gmail.com'
  })
  email: string;
  @ApiProperty({
    description: 'User password',
    example: '9039^*7HJJS'
  })
  password?: string;
  clientId?: string;
}

export interface GetUser {
  email?: string;
  clientId?: string;
}
