import {
  Injectable,
  Logger,
  InternalServerErrorException,
  Inject,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { EventBus } from '@nestjs/cqrs';
import { UserCreatedEvent } from './events/created.event';
import { NotFoundException } from '@nestjs/common';
import * as moment from 'moment';
import { ValidatedUserEvent } from './events/validated.event';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly eventBus: EventBus,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      const createdUser = new this.userModel(createUserDto);
      createdUser.validationCode =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      await createdUser.save();

      this.eventBus.publish(new UserCreatedEvent(createdUser));
      return createdUser;
    } catch (err) {
      Logger.error(err, 'User Create');
      throw new InternalServerErrorException(err, 'error.user.notCreated');
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async find(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async validate(id: string, validationCode: string): Promise<User> {
    try {
      const user = await this.find(id);
      if (!user) {
        throw new NotFoundException('error.validation.notFound');
      }

      if (user.validationCode === validationCode) {
        user.validatedAt = moment().toDate();
        user.validationCode = undefined;
        await user.save();
        this.eventBus.publish(new ValidatedUserEvent(user));
        return user;
      }
      throw new NotFoundException('error.validation.notFound');
    } catch (err) {
      Logger.error(err);
    }
  }
}
