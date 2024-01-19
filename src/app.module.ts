import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './settings/validation';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BasicStrategy } from 'src/utils/strategies/basic/basic.strategy';
import { AccessTokenStrategy } from 'src/utils/strategies/jwt/accessToken.strategy';
import { RefreshTokenStrategy } from 'src/utils/strategies/jwt/refreshToken.strategy';

import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './routes/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    { ...JwtModule.register({}), global: true },
    DatabaseModule,
    RedisModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BasicStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AppModule {}
