import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Estatus } from "@comfeco/interfaces";

import { ConfigService } from "../config.service";
import { Configuracion } from "../config.keys";
import { JwtPayload } from "./jwt_payload.interface";
import { UsuarioRepository } from "../../app/usuario/usuario.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor(
        private readonly _configService: ConfigService,
        private readonly _usuarioRepository: UsuarioRepository ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: _configService.get(Configuracion.JWT_SECRETO)
        });
    }

    async validate(payload:JwtPayload) {
        const { correo } = payload;
        const usuarioBase = await this._usuarioRepository.validarExistenciaCorreo(correo);

        if(usuarioBase==null || !usuarioBase || usuarioBase.estatus!=Estatus.ACTIVO) {
            throw new UnauthorizedException();
        }

        return payload;
    }
    
}