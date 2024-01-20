import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from 'src/database/repositories';
import { encryptPassword } from 'src/utils/functions';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userRepository: UserRepository,
  ) {}

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
    const usersKey = 'users-key';
    const cachedUsers = await this.cacheManager.get(usersKey);
    if (cachedUsers) {
      return cachedUsers;
    }
    const usersFound = await this.userRepository.getUsers();
    await this.cacheManager.set(usersKey, usersFound, 1000 * 10);
    return usersFound;
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
    for (let i = 1; i <= 1000; i++) {
      await this.userRepository.save(
        this.userRepository.create({
          email: `generated-#${i}@testing.com`,
          password: encryptPassword(`generated-#${i}`),
        }),
      );
    }
  }
}
