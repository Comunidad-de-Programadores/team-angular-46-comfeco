import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';
import jwt from 'jsonwebtoken';

import { Status, AccountType, GenericResponse, RegisterDto, TokenDto, LoginDto, RecoverAccountDto, ChangePasswordDto, ExpresionRegex } from '@comfeco/interfaces';
import { UtilResponse, ValidatorService } from '@comfeco/validator';

import { AuthService } from '../auth.service';
import { EmailService } from '../../../config/email/email.service';
import { FacebookService } from '../facebook/facebook.service';
import { GoogleService } from '../google/google.service';
import { UserEntity } from './../../user/user.entity';
import { UserRepository } from './../../user/user.repository';
import { ConfigService } from '../../../config/config.service';
import { Configuration } from '../../../config/config.keys';

@Injectable()
export class BasicService {
    private readonly logger = new Logger(BasicService.name);

    constructor(
        private _configService: ConfigService,
        private _userRepository: UserRepository,
        private _googleService: GoogleService,
        private _facebookService: FacebookService,
        private _authService: AuthService,
        private _emailService: EmailService
    ) {}
    
    async register(registerDto:RegisterDto): Promise<TokenDto | GenericResponse> {
        const { user, email, password, terms } = registerDto;
        let validation:GenericResponse;
        
        if(!terms) {
            return UtilResponse.genericResponse('',['Es necesario aceptar las políticas de privacidad, así como los términos y condiciones'], HttpStatus.BAD_REQUEST);
        }

        validation = ValidatorService.user(user, validation);
        validation = ValidatorService.email(email, validation);
        validation = ValidatorService.password(password, validation);
        if(validation!=null) return validation;

        let mensajeError:string;
        let baseUser:UserEntity = await this._userRepository.userExists(user);

        if(baseUser!=null) {
            mensajeError = 'El usuario ya se encuentra registrado';
        } else {
            baseUser = await this._userRepository.emaiTypeExists(email);

            if(baseUser!=null) {
                mensajeError = 'El correo ya se encuentra registrado';
            }
        }

        if(mensajeError) {
            return UtilResponse.genericResponse('',[mensajeError], HttpStatus.BAD_REQUEST);
        }

        const token:TokenDto = this._authService.createAccessToken(user, email, HttpStatus.CREATED);

        await this._userRepository.registerUserEmail(registerDto, token.token);

        return token;
    }

    async userExists(loginDto:LoginDto): Promise<TokenDto | GenericResponse> {
        const { user, email, password } = loginDto;
        let validation:GenericResponse;
        
        if(!user && !email) {
            return UtilResponse.genericResponse('',['Es necesario enviar el usuario o el correo para poder validar las credenciales'], HttpStatus.UNAUTHORIZED);
        }
        
        if(email) {
            validation = ValidatorService.email(email, validation);
        }

        validation = ValidatorService.password(password, validation);
        if(validation!=null) return validation;

        const baseUser:UserEntity = await this._validarExistenciaUsuarioCorreo(user, email);
        
        if(baseUser==null) {
            return UtilResponse.genericResponse('',['Credenciales incorrectas'], HttpStatus.UNAUTHORIZED);
        }

        if(baseUser.status!=Status.ACTIVE) {
            return UtilResponse.genericResponse('',['El usuario ha sido dado de baja temporalmente'], HttpStatus.UNAUTHORIZED);
        }
        
        const { message } = await this._compararContrasenias(password, baseUser);
        
        if(message) {
            return UtilResponse.genericResponse('',[message], HttpStatus.UNAUTHORIZED);
        }

        const token:TokenDto = this._authService.createAccessToken(baseUser.user, baseUser.email, HttpStatus.OK);

        baseUser.tokenApi = token.token;

        await this._userRepository.updateTokenUser(baseUser);

        return token;
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

    private async _compararContrasenias(contrasenia:string, baseUser:UserEntity): Promise<GenericResponse> {
        let message:String;

        if(baseUser==null) {
            message = 'Credenciales invalidas';
        } else {
            const passwordInvalid = await bcrypt.compare(contrasenia, baseUser.password);
            
            if(!passwordInvalid) {
                message = 'Credenciales invalidas';
            }
        }

        return new Promise((resolver) => {
            resolver({
                message
            } as GenericResponse);
        });
    }

    async renewToken(usuario:string, token:string): Promise<TokenDto | GenericResponse> {
        let validation:GenericResponse;
        
        validation = ValidatorService.user(usuario, validation);
        validation = ValidatorService.token(token, validation);
        if(validation!=null) return validation;

        const baseUser:UserEntity = await this._userRepository.userExists(usuario);

        if(baseUser==null || baseUser.tokenApi!==token) {
            return UtilResponse.genericResponse('',['Usuario invalido'], HttpStatus.UNAUTHORIZED);
        }

        const newToken:TokenDto = this._authService.createAccessToken(usuario, baseUser.email, HttpStatus.OK);
        
        baseUser.tokenApi = newToken.token;

        await this._userRepository.updateTokenUser(baseUser);

        return newToken;
    }
    
    async recoverAccount(recuperarContraseniaDto:RecoverAccountDto): Promise<GenericResponse> {
        const { user, email } = recuperarContraseniaDto;
        let validation:GenericResponse;
        
        let baseUser:UserEntity;

        if(user) {
            validation = ValidatorService.user(user, validation);
            if(validation!=null) return validation;
            
            baseUser = await this._userRepository.userExists(user);
        } else {
            validation = ValidatorService.email(email, validation);
            if(validation!=null) return validation;
            
            baseUser = await this._userRepository.emaiTypeExists(email);
        }
        
        if(baseUser!==null) {
            const newToken = jwt.sign({id:Math.floor(Math.random()*100)}, this._configService.get(Configuration.JWT_SECRET), {
                algorithm: "HS256",
                expiresIn: this._configService.get(Configuration.JWT_TIME_EXPIRATION_EMAIL),
            });

            baseUser.tokenApi=newToken;
            await this._userRepository.updateTokenUser(baseUser);

            try {
                await this._emailService.recoverAccount(baseUser);
            } catch(err) {
                return UtilResponse.genericResponse('',['No es posible enviar el correo electrónico, favor de intentar más tarde'], HttpStatus.BAD_REQUEST);    
            }
        }

        if(!baseUser) {
            return UtilResponse.genericResponse('',['No existe una cuenta con los datos proporcionados'], HttpStatus.BAD_REQUEST);
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
        if(validation!=null) return validation;

        try {
            jwt.verify(token, this._configService.get(Configuration.JWT_SECRET));
        } catch(err) {
            this.logger.debug(err.message);
            tokenExpired = true;
        }

        if(!password || !ExpresionRegex.PASSWORD.test(password) || tokenExpired) {
            return UtilResponse.genericResponse('',['No es posible modificar la contraseña de la cuenta'], HttpStatus.BAD_REQUEST);
        }

        let baseUser:UserEntity;

        baseUser = await this._userRepository.tokenChangePasswordExists(token);

        if(!baseUser || baseUser.type!=AccountType.EMAIL) {
            return UtilResponse.genericResponse('',['No es posible modificar la contraseña de la cuenta'], HttpStatus.BAD_REQUEST);
        } else {
            baseUser.password = await bcrypt.hash(password, 10);
            baseUser.tokenApi = '';
            await this._userRepository.updateTokenUser(baseUser);

            return UtilResponse.genericResponse('Se cambio satisfactoriamente la contraseña de la cuenta',[], HttpStatus.ACCEPTED);
        }
    }

    async logout(email:string): Promise<GenericResponse> {
        let validation:GenericResponse;

        validation = ValidatorService.email(email, validation);
        if(validation!=null) return validation;

        const baseUser:UserEntity = await this._userRepository.emailExists(email);
        let response:GenericResponse;

        if(baseUser.type==AccountType.GOOGLE) {
            const salirGoogle$ = this._googleService.logout(baseUser.tokenGoogle);
            response = this._responseLogoutSocialNetwork(salirGoogle$);
        }

        if(baseUser.type==AccountType.FACEBOOK) {
            const salirFacebook$ = this._facebookService.logout(baseUser.idFacebook, baseUser.tokenFaceook);response = this._responseLogoutSocialNetwork(salirFacebook$);
        }

        if(response==undefined) {
            response = await UtilResponse.genericResponse('El usuario salió exitosamente del aplicativo',[], HttpStatus.OK);
        }

        baseUser.tokenApi = '';

        this._userRepository.updateTokenUser(baseUser);

        return response;
    }

    private _responseLogoutSocialNetwork(observableService$:Observable<GenericResponse>): GenericResponse {
        let response:GenericResponse;
        const logoutResponse = observableService$.subscribe(
            resp => response = resp
        );
        
        logoutResponse.unsubscribe();
        
        return response;
    }

}
