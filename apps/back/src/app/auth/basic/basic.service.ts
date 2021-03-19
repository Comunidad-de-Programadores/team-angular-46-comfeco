import { Injectable, HttpStatus, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Status, AccountType, GenericResponse, RegisterDto, LoginDto, RecoverAccountDto, ChangePasswordDto, ExpresionRegex } from '@comfeco/interfaces';
import { UtilResponse, ValidatorService } from '@comfeco/validator';

import { AuthService } from '../auth.service';
import { EmailService } from '../../../config/email/email.service';
import { UserRepository } from './../../inner/user/user.repository';
import { ConfigService } from '../../../config/config.service';
import { Configuration } from '../../../config/config.keys';
import { JwtUtil } from '../../../util/jwt/jwt.util';
import { UserEntity } from '../../inner/user/model/user.entity';
import { ParametersExcepcion } from '../../../util';
import { TokenCookieDto } from '../tokenCookieDto';
import { TokenResponseDto } from '../tokensResponse';
import { environment } from '../../../environments/environment';
import { FacebookLogoutService } from '../facebook/facebook-logout.service';
import { GoogleLogoutService } from '../google/google-logout.service';

@Injectable()
export class BasicService {
    private readonly logger = new Logger(BasicService.name);

    constructor(
        private readonly _configService: ConfigService,
        private readonly _facebookService: FacebookLogoutService,
        private readonly _googleService: GoogleLogoutService,
        private readonly _userRepository: UserRepository,
        private readonly _authService: AuthService,
        private readonly _emailService: EmailService
    ) {}
    
    async register(registerDto:RegisterDto): Promise<TokenResponseDto> {
        const { user, email, password, terms } = registerDto;
        let validation:GenericResponse;
        
        if(!terms) {
            throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: ['Es necesario aceptar las políticas de privacidad, así como los términos y condiciones'] });
        }

        validation = ValidatorService.user(user, validation);
        validation = ValidatorService.email(email, validation);
        validation = ValidatorService.password(password, validation);
        if(validation!=null) throw new ParametersExcepcion(validation);

        let mensajeError:string;
        let baseUser:UserEntity = await this._userRepository.userExists(user);

        if(baseUser!=null && baseUser.type.includes(AccountType.EMAIL)) {
            mensajeError = 'El usuario ya se encuentra registrado';
        } else {
            baseUser = await this._userRepository.emaiTypeExists(email);

            if(baseUser!=null) {
                mensajeError = 'El correo ya se encuentra registrado';
            }
        }

        if(mensajeError) {
            throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: [mensajeError] });
        }

        await this._userRepository.registerUserEmail(registerDto);
        
        baseUser = await this._userRepository.userExists(user);
        
        return await this.updateAndCreateToken(baseUser, AccountType.EMAIL);
    }

    async login(loginDto:LoginDto): Promise<TokenResponseDto> {
        const { user, email, password } = loginDto;
        let validation:GenericResponse;
        
        if(!user && !email) {
            throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: ['Es necesario enviar el usuario o el correo para poder validar las credenciales'] });
        }
        
        if(email) {
            validation = ValidatorService.email(email, validation);
        }
        
        validation = ValidatorService.password(password, validation);
        if(validation!=null) throw new ParametersExcepcion(validation);

        const baseUser:UserEntity = await this._validarExistenciaUsuarioCorreo(user, email);
        
        if(baseUser==null) {
            throw new UnauthorizedException();
        }

        if(baseUser.status!=Status.ACTIVE) {
            throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: ['El usuario ha sido dado de baja temporalmente'] });
        }
        
        const invalidPassword:boolean = await this._comparePassword(password, baseUser);
        if(invalidPassword) throw new UnauthorizedException();

        return await this.updateAndCreateToken(baseUser, AccountType.EMAIL);
    }

    private async _validarExistenciaUsuarioCorreo(usuario:string, correo:string): Promise<UserEntity> {
        let baseUser:UserEntity;

        if(usuario) {
            baseUser = await this._userRepository.userExists(usuario);
        } else if(correo) {
            baseUser = await this._userRepository.emaiTypeExists(correo);
        } else {
            return null;
        }

        return baseUser;
    }

    private async _comparePassword(password:string, baseUser:UserEntity): Promise<boolean> {
        let invalid:boolean = false;

        if(baseUser==null) {
            invalid = true;
        } else {
            const passwordInvalid:boolean = await bcrypt.compare(password, baseUser.password);
            
            if(!passwordInvalid) {
                invalid = true;
            }
        }

        return invalid;
    }

    async renewToken(id:string, token:string): Promise<TokenResponseDto> {
        let validation:GenericResponse;
        
        validation = ValidatorService.token(token, validation);
        if(validation!=null) throw new ParametersExcepcion(validation);

        const baseUser:UserEntity = await this._userRepository.idExists(id);
        const type:AccountType = JwtUtil.tokenType(token, this._configService.get(Configuration.JWT_TOKEN_SECRET));
        
        return await this.updateAndCreateToken(baseUser, type);
    }
    
    async updateAndCreateToken(baseUser:UserEntity, type:AccountType): Promise<TokenResponseDto> {
        const accessToken:TokenCookieDto = this._authService.createAccessToken(baseUser.id, type);
        const refreshToken:TokenCookieDto = this._authService.createRefreshToken(baseUser.id, type);

        const tokenResponse:TokenResponseDto = {
            accessToken,
            refreshToken,
            user: baseUser.user
        }

        baseUser.tokenApi = accessToken.token;
        baseUser.tokenRefreshApi = refreshToken.token;
        
        await this._userRepository.updateTokenApi(baseUser);

        return tokenResponse;
    }

    async recoverAccount(recuperarContraseniaDto:RecoverAccountDto): Promise<GenericResponse> {
        const { user, email } = recuperarContraseniaDto;
        let validation:GenericResponse;
        
        let baseUser:UserEntity;

        if(user) {
            validation = ValidatorService.user(user, validation);
            if(validation!=null) throw new ParametersExcepcion(validation);
            
            baseUser = await this._userRepository.userExists(user);
        } else {
            validation = ValidatorService.email(email, validation);
            if(validation!=null) throw new ParametersExcepcion(validation);
            
            baseUser = await this._userRepository.emaiTypeExists(email);
        }
        
        if(baseUser!==null) {
            const newToken = jwt.sign({id:Math.floor(Math.random()*100)}, this._configService.get(Configuration.JWT_EMAIL_TOKEN_SECRET), {
                algorithm: "HS256",
                expiresIn: this._configService.get(Configuration.JWT_EMAIL_TOKEN_EXPIRATION_TIME),
            });
            
            baseUser.tokenApi=newToken;
            await this._userRepository.updateTokenUser(baseUser);

            try {
                await this._emailService.recoverAccount(baseUser);
            } catch(err) {
                this.logger.error('No se puede enviar el correo', err);
                throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: ['No es posible enviar el correo electrónico, favor de intentar más tarde'] });
            }
        }

        if(!baseUser) {
            throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: ['No existe una cuenta con los datos proporcionados'] });
        } else {
            return UtilResponse.genericResponse('Se envió un correo electrónico para recuperar su cuenta. Revisar en la carpeta de correos no deseados',[], HttpStatus.OK);
        }
    }

    async changePassword(changePassword:ChangePasswordDto): Promise<GenericResponse> {
        const { password, token } = changePassword;
        
        let validation:GenericResponse;
        let tokenExpired:boolean = false;

        validation = ValidatorService.password(password, validation);
        validation = ValidatorService.token(token, validation);
        if(validation!=null) throw new ParametersExcepcion(validation);

        try {
            const payload:any = jwt.verify(token, this._configService.get(Configuration.JWT_EMAIL_TOKEN_SECRET));
            const dateNow = Date.now()/1000;
            if(dateNow>payload?.exp) throw new UnauthorizedException();
        } catch(err) {
            this.logger.debug(err.message);
            tokenExpired = true;
        }

        if(!password || !ExpresionRegex.PASSWORD.test(password) || tokenExpired) {
            throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: ['No es posible modificar la contraseña de tu cuenta'] });
        }

        let baseUser:UserEntity;

        baseUser = await this._userRepository.tokenChangePasswordExists(token);

        if(!baseUser || !baseUser.type.includes(AccountType.EMAIL)) {
            throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: ['No es posible modificar la contraseña de tu cuenta'] });
        } else {
            baseUser.password = await bcrypt.hash(password, environment.salt_rounds);
            baseUser.tokenApi = '';
            await this._userRepository.updateTokenUser(baseUser);

            return UtilResponse.genericResponse('Se cambio satisfactoriamente la contraseña de tu cuenta',[], HttpStatus.ACCEPTED);
        }
    }

    async logout(token:string, id:string): Promise<string> {
        let validation:GenericResponse;
        
        validation = ValidatorService.token(token, validation);
        if(validation!=null) throw new ParametersExcepcion(validation);
        
        const baseUser:UserEntity = await this._userRepository.idExists(id);
        const type:AccountType = JwtUtil.tokenType(token, this._configService.get(Configuration.JWT_TOKEN_SECRET));
        let respSocial:GenericResponse;
        
        if(baseUser===null) {
            throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: ['Usuario inexistente'] });
        }
        
        let messageResponse:string;
        let exit:boolean;
        
        if(type===AccountType.FACEBOOK) {
            respSocial = await this._facebookService.logout(baseUser);
        } else if(type===AccountType.GOOGLE) {
            respSocial = await this._googleService.logout(baseUser);
        } else {
            messageResponse = 'Saliste exitosamente del aplicativo';
            exit = true;
        }

        if(type===AccountType.FACEBOOK || type===AccountType.GOOGLE) {
            if(respSocial.code===HttpStatus.OK) {
                messageResponse = respSocial.message;
                exit = true;
            } else {
                messageResponse = respSocial.errors[0];
                exit = false;
            }
        }

        if(exit) {
            baseUser.tokenApi = '';
            baseUser.tokenRefreshApi = '';
    
            await this._userRepository.updateTokenUser(baseUser);
        }

        return messageResponse;
    }

}
