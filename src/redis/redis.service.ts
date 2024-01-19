import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

export const redisProvider = CacheModule.registerAsync({
  imports: [ConfigModule.forRoot({})],
  inject: [ConfigService],
  isGlobal: true,
  useFactory: async (configService: ConfigService) => {
    return {
      store: await redisStore({
        socket: {
          host: configService.get<string>('RDS_HOST'),
          port: configService.get<number>('RDS_PORT'),
        },
      }),
      then: Logger.debug(
        `redis host:${configService.get<string>('RDS_HOST')}`,
        `DB =>`,
      ),
    };
  },
});
