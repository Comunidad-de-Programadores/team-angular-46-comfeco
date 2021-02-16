import { Module } from '@nestjs/common';

import { ConfigService } from './config.service';
import { CorreoModule } from './correo/correo.module';

@Module({
    providers: [ ConfigService ],
    exports: [ ConfigService ],
    imports: [ CorreoModule ],
})
export class ConfigModule {}
