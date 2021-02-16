import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

import { environment } from './../../environments/environment';
import { ConfigService } from '../config.service';
import { Configuracion } from '../config.keys';
import { UsuarioEntidad } from '../../app/usuario/usuario.entity';

@Injectable()
export class CorreoService {
    private readonly logger = new Logger(CorreoService.name);

    constructor(
        private readonly _configService: ConfigService,
        private readonly _mailerService: MailerService) {}
    
    async recuperarCuenta(usuaroBase:UsuarioEntidad): Promise<SentMessageInfo> {
        const { correo, usuario, nombre, apellido_paterno='', apellido_materno='', tokenApi } = usuaroBase;
        const nombreUsuario = nombre ? `${nombre} ${apellido_paterno} ${apellido_materno}` : usuario;
        
        return await this._mailerService.sendMail({
            to: correo,
            from: this._configService.get(Configuracion.GOOGLE_EMAIL),
            subject: `Recuperación de acceso al aplicativo ${environment.titulo}`,
            template: 'recuperar_cuenta',
            context: { usuario: nombreUsuario, url: `${environment.url_recuperar_cuenta}${tokenApi}` },
        });
    }
    
}
