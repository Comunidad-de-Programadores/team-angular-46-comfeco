import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

import { environment } from './../../environments/environment';
import { ConfigService } from '../config.service';
import { Configuration } from '../config.keys';
import { UserEntity } from '../../app/user/user.entity';

@Injectable()
export class EmailService {

    constructor(
        private readonly _configService: ConfigService,
        private readonly _mailerService: MailerService) {}
    
    async recoverAccount(baseUser:UserEntity): Promise<SentMessageInfo> {
        const { email, user, name, lastname='', tokenApi } = baseUser;
        const username = name ? `${name} ${lastname}` : user;
        
        return await this._mailerService.sendMail({
            to: email,
            from: this._configService.get(Configuration.GOOGLE_EMAIL),
            subject: `Recuperación de acceso al aplicativo ${environment.title}`,
            template: 'recover_account',
            context: { username, url: `${environment.url_recover_account}${tokenApi}` },
        });
    }
    
}
