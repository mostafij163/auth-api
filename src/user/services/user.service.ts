import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';

import { UserDTO } from './../dto/user.dto';
import { User, UserDocument } from './../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userDto: UserDTO): Promise<User> {
    try {
      var hashedPassword = await bcrypt.hash(userDto.password, 10);
    } catch (error) {
      throw new Error(error);
    }

    try {
      const newUser = await this.userModel.create({
        name: userDto.name,
        email: userDto.email,
        password: hashedPassword,
      });

      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }
}
