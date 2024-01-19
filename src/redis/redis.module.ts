import { Module } from '@nestjs/common';
import { redisProvider } from './redis.service';

@Module({
  imports: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
