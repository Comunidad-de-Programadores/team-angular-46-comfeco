import { Module } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { JwtUtil } from './jwt.util';

@Module({
    providers: [ConfigService, JwtUtil],
    exports: [JwtUtil]
})
export class JwtUtilModule {}
