import { Module } from '@nestjs/common';

import { ConfigService } from './config.service';
import { EmailModule } from './email/email.module';

@Module({
    providers: [ ConfigService ],
    exports: [ ConfigService ],
    imports: [ EmailModule ],
})
export class ConfigModule {}
