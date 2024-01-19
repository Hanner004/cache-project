import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from 'src/database/repositories';
import { encryptPassword } from 'src/utils/functions';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async create({ email, password }: CreateUserDto) {
    const userEmailFound = await this.userRepository.findOne({
      where: { email },
    });
    if (userEmailFound) throw new ConflictException('email already exists');
    const user = await this.userRepository.save(
      this.userRepository.create({
        email,
        password: encryptPassword(password),
      }),
    );
    delete user.password;
    return user;
  }

  async findAll() {
    return await this.userRepository.getUsers();
  }

  async findOne(id: string) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) throw new NotFoundException('user not found');
    return userFound;
  }

  async remove(id: string) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) throw new NotFoundException('user not found');
    return await this.userRepository.softDelete({ id });
  }

  async generate() {
    for (let i = 1; i <= 50; i++) {
      await this.userRepository.save(
        this.userRepository.create({
          email: `generated-#${i}@testing.com`,
          password: encryptPassword(`generated-#${i}`),
        }),
      );
    }
  }
}
