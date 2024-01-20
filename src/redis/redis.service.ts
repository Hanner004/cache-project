import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const redisProvider = CacheModule.registerAsync({
  imports: [ConfigModule.forRoot({})],
  inject: [ConfigService],
  isGlobal: true,
  useFactory: async (configService: ConfigService) => {
    const socketConfig = {
      host: configService.get<string>('RDS_HOST'),
      port: configService.get<number>('RDS_PORT'),
    };
    const store = await redisStore({ socket: socketConfig });
    Logger.debug(`Redis host: ${socketConfig.host}`, 'Redis Module');
    return { store };
  },
} as CacheModuleAsyncOptions);
