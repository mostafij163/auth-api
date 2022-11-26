import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

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

  async getAUser(email: string): Promise<User> {
    try {
      const user = this.userModel.findOne({ email: email });

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}
