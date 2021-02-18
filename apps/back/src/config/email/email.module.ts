import { DynamicModule, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer'; 
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

import { ConfigService } from '../config.service';
import { EmailService } from './email.service';

const moduleEmail:DynamicModule = MailerModule.forRoot({
    transport: {
        service: process.env.GOOGLE_SERVICE,
        auth: {
            type: 'OAuth2',
            user: process.env.GOOGLE_EMAIL,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: process.env.GOOGLE_ACCESS_TOKEN,
        },
    },
    defaults: {
        from:`"Comfeco Team Angular 46" <${process.env.GOOGLE_EMAIL}>`,
    },
    template: {
        dir: process.cwd() + '/apps/back/src/emails',
        adapter: new PugAdapter(),
        options: {
            strict: true,
        },
    },
});

@Module({
    imports: [ moduleEmail ],
    providers: [ ConfigService, EmailService ],
    exports: [ EmailService ],
})
export class EmailModule {}
