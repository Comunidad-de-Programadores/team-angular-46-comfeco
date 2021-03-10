import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AccountType, CountryDto, EventDayDto, EventsDayDto, Gender, GenericResponse, InsigniaDto, InsigniasDto, KnowledgeAreaDto, UserChangeInformationDto, UserDto, UserSocialNetworksDto } from '@comfeco/interfaces';
import { UtilResponse, ValidatorService } from '@comfeco/validator';

import { UserRepository } from './user.repository';
import { JwtUtil } from '../../../util/jwt/jwt.util';
import { UserEntity } from './model/user.entity';
import { SocialNetworkEntity } from './model/social_network.entity';
import { ParametersExcepcion } from '../../../util';
import { ConfigService } from '../../../config/config.service';
import { Configuration } from '../../../config/config.keys';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
    
    constructor(
        private readonly _configService: ConfigService,
        private readonly _userRepository: UserRepository
    ){}

    async basicInformation(id:string, token:string): Promise<UserDto | GenericResponse> {
        const userEntity:UserEntity = await this._userRepository.idExists(id);

        const { user, email, roles } = userEntity;

        const userInformation:UserDto = {
            code: HttpStatus.OK,
            photoUrl: await this._urlUser(userEntity, token),
            user,
            email,
            roles,
        };
        
        return userInformation;
    }

    async profileInformation(id:string, token:string): Promise<UserDto | GenericResponse> {
        const userEntity:UserEntity = await this._userRepository.idExists(id);

        const { user, email, roles, description, birdth_date, specialities, gender, country } = userEntity;
        const genderEntity:Gender = await this._userRepository.informationGender(gender.prefix);

        const userInformation:UserDto = {
            code: HttpStatus.OK,
            social_networks: await this._socialNetworksUser(userEntity),
            photoUrl: await this._urlUser(userEntity, token),
            gender: genderEntity,
            country, 
            user,
            email,
            description,
            birdth_date,
            specialities,
            roles,
        };
        
        return userInformation;
    }
    
    async insignias(id:string): Promise<InsigniasDto | GenericResponse> {
        const insigniasEntity:InsigniaDto[] = await this._userRepository.insignias(id);

        if(insigniasEntity==null) {
            return UtilResponse.genericResponse('',['El usuario no cuenta con insignias obtenidas'], HttpStatus.NOT_FOUND);
        }
        
        let insigniasTemp:InsigniaDto[] = [];

        insigniasEntity.forEach(insignia => {
            const { name } = insignia;
            insigniasTemp.push({ name });
        });
        
        const insignias:InsigniasDto = {
            code: HttpStatus.OK,
            insignias: insigniasTemp
        }

        return insignias;
    }

    async events(id:string): Promise<EventsDayDto | GenericResponse> {
        const eventsEntity:EventDayDto[] = await this._userRepository.events(id);
        
        if(eventsEntity==null) {
            return UtilResponse.genericResponse('',['El usuario no tiene calendarizado ningún evento'], HttpStatus.NOT_FOUND);
        }
        
        let eventsTemp:EventDayDto[] = [];

        eventsEntity.forEach((event:any) => {
            const { image, topic, url } = event.event;

            eventsTemp.push({
                image,
                topic,
                url
            });
        });

        const events:EventsDayDto = {
            code: HttpStatus.OK,
            events: eventsTemp
        }

        return events;
    }

    async recentActivity(id:string): Promise<EventsDayDto | GenericResponse> {
        const eventsEntity:EventDayDto[] = await this._userRepository.recentActivity(id);
        
        if(eventsEntity==null) {
            return UtilResponse.genericResponse('',['No has agregado ningún evento recientemente'], HttpStatus.NOT_FOUND);
        }
        
        let eventsTemp:EventDayDto[] = [];

        eventsEntity.forEach((event:any) => {
            const { image, topic, url } = event.event;

            eventsTemp.push({
                image,
                topic,
                url
            });
        });

        const events:EventsDayDto = {
            code: HttpStatus.OK,
            events: eventsTemp
        }

        return events;
    }

    async changeInformation(file:any, id:string, changeInformation:UserChangeInformationDto): Promise<UserDto | GenericResponse> {
        const validation = ValidatorService.password(changeInformation.password, null);
        if(validation!=null) throw new ParametersExcepcion(validation);

        const actualUser:UserEntity = await this._userRepository.idExists(id);
        const validateErrors = await this._validateErrorsChangeInformation(actualUser, changeInformation);
        if(validateErrors!==null) {
            return validateErrors;
        }
        
        const pictureUrl:string = await this._pictureProfileUpload(file, id);
        const newInformationUser:any = await this._parseParamsToDataBaseChangeInformation(changeInformation, pictureUrl);
        const socialNetwoks:any[] = await this._parseParamsSocialNetworksChangeInformation(changeInformation);
        
        await this._userRepository.updateUser(id, newInformationUser);
        
        socialNetwoks.forEach(async (socialNetwok:any) => {
            await this._userRepository.updateSocialNetworksUser(id, socialNetwok);
        })
        
        const userNew = changeInformation?.user || actualUser.user;

        const newUser:UserEntity = await this._userRepository.userExists(userNew);

        const { photoUrl, user:userNewReturn, email, roles } = newUser;

        const userReturn:UserDto = {
            code: HttpStatus.ACCEPTED,
            user:userNewReturn,
            photoUrl,
            email,
            roles,
        }

        return userReturn;
    }

    private async _pictureProfileUpload(file:any, idUser:string): Promise<string> {
        const fileUpload = file && file.buffer;
        let pictureUrl:string;

        if(!!fileUpload) {
            pictureUrl = await this._userRepository.upload(fileUpload, idUser);
        }

        return pictureUrl;
    }
    
    private async _parseParamsToDataBaseChangeInformation(changeInformation:UserChangeInformationDto, pictureUrl:string) {
        const newInformationUser:any = {};
        
        const tempCountry:any = changeInformation?.country;
        const countryInformation = !!tempCountry ? JSON.parse(tempCountry) : null;
        const tempSpecialities:any = changeInformation?.specialities;
        const specialities = !!tempSpecialities ? JSON.parse(tempSpecialities) : '';
        const date:any = changeInformation?.birdth_date;
        
        if(!!changeInformation?.password_new) {
            const encryptedPassword = await bcrypt.hash(changeInformation.password_new, environment.salt_rounds);
            newInformationUser.password = encryptedPassword;
        }

        if(!!pictureUrl) {
            newInformationUser.modify = true;
            newInformationUser.photoUrl = pictureUrl;
        }

        newInformationUser.user = changeInformation?.user;
        newInformationUser.email = changeInformation?.email;
        newInformationUser.description = changeInformation?.description;
        if(!!date) newInformationUser.birdth_date = new Date(parseInt(date));
        
        if(!!countryInformation) {
            const country:CountryDto = {
                flag: countryInformation?.flag,
                name: countryInformation?.name
            };

            newInformationUser.country = country;
        }

        if(!!specialities) {
            newInformationUser.specialities = [];
            specialities.forEach(async(speciality:string)=> {
                newInformationUser.specialities.push(await this._userRepository.referenceKnowledgeArea(speciality));
            })
        }

        if(changeInformation?.gender) {
            newInformationUser.gender = await this._userRepository.referenceGender(changeInformation.gender);
        }

        return newInformationUser;
    }

    private async _parseParamsSocialNetworksChangeInformation(changeInformation:UserChangeInformationDto) {
        /*newInformationUser.social_networks = {
            facebook : changeInformation?.social_networks?.facebook,
            twitter : changeInformation?.social_networks?.twitter,
            github : changeInformation?.social_networks?.github,
            linkedin : changeInformation?.social_networks?.linkedin
        };*/
        
        let socialNetwoks:any[] = [];

        if(changeInformation?.social_networks) {
            const tempSocial:any = changeInformation?.social_networks;
            const social = JSON.parse(tempSocial);
            
            socialNetwoks.push({ type: 'facebook', url: social.facebook })
            socialNetwoks.push({ type: 'github', url: social.github })
            socialNetwoks.push({ type: 'twitter', url: social.twitter })
            socialNetwoks.push({ type: 'linkedin', url: social.linkedin })
        }

        return socialNetwoks;
    }

    private async _validateErrorsChangeInformation(actualUser:UserEntity, changeInformation:UserChangeInformationDto): Promise<UserDto | GenericResponse> {
        const errors:string[] = [];
        let error:string;

        if(actualUser===null) {
            return UtilResponse.genericResponse('',['El usuario no existe en la base de datos'], HttpStatus.BAD_REQUEST);
        }
        
        if(actualUser.password) {
            const errorPassword:string = 'Es necesario introducir las credenciales correctas para actualizar la información';
            let errorData:boolean = false;

            if(!changeInformation?.password) {
                errorData = true;
            } else {
                const passwordInvalid:boolean = await bcrypt.compare(changeInformation.password, actualUser.password);

                if(!passwordInvalid) {
                    errorData = true;
                }
            }

            if(errorData) {
                return UtilResponse.genericResponse('',[errorPassword], HttpStatus.BAD_REQUEST);
            }
        }

        error = await this._userValid(actualUser, changeInformation);
        if(error) errors.push(error);
        
        error = await this._emailValid(actualUser, changeInformation);
        if(error) errors.push(error);
        

        if(errors.length) {
            return UtilResponse.genericResponse('', errors, HttpStatus.BAD_REQUEST);
        }

        return null;
    }

    private async _userValid(actualUser:UserEntity, changeInformation:UserChangeInformationDto) {
        let error:string;

        if(changeInformation?.user && actualUser.user!==changeInformation?.user) {
            const baseUser:UserEntity = await this._userRepository.userExists(changeInformation.user);
            if(baseUser!=null) {
                error = 'Usuario no disponible';
            }
        }

        return error;
    }

    private async _emailValid(actualUser:UserEntity, changeInformation:UserChangeInformationDto) {
        let error:string;

        if(changeInformation?.email && actualUser.email!==changeInformation?.email) {
            const baseUser:UserEntity = await this._userRepository.emailExists(changeInformation.email);
            if(baseUser!=null) {
                error = 'Correo no disponible';
            }
        }

        return error;
    }

    /*async upload(file:any, name:string, user:string): Promise<string | GenericResponse> {
        const userEntity:UserEntity = await this._userRepository.userExists(user);
        
        if(userEntity==null) {
            return UtilResponse.genericResponse('',['El usuario no tiene información en la base de datos'], HttpStatus.BAD_REQUEST);
        }
        
        return await this._userRepository.upload(file, userEntity.id);
    }*/

    private async _urlUser(userEntity:UserEntity, token:string): Promise<string> {
        const type:AccountType = JwtUtil.tokenType(token, this._configService.get(Configuration.JWT_TOKEN_SECRET));
        return type===AccountType.EMAIL || userEntity?.modify
            ? userEntity.photoUrl
            : type===AccountType.FACEBOOK
            ? userEntity.facebook.photoUrl
            : userEntity.google.photoUrl;
    }

    private async _socialNetworksUser(userEntity:UserEntity) {
        const socialEntity:SocialNetworkEntity[] = await this._userRepository.userSocialNetworks(userEntity.id);

        let facebook:string;
        let github:string;
        let twitter:string;
        let linkedin:string;

        if(socialEntity) {
            socialEntity.forEach(data => {
                facebook = this._urlSocialNetwork(data, 'facebook', facebook);
                github = this._urlSocialNetwork(data, 'github', github);
                twitter = this._urlSocialNetwork(data, 'twitter', twitter);
                linkedin = this._urlSocialNetwork(data, 'linkedin', linkedin);
            });
        }

        const socialNetworks:UserSocialNetworksDto = {
            facebook,
            github,
            twitter,
            linkedin,
        };

        return socialNetworks;
    }

    private _urlSocialNetwork(object:SocialNetworkEntity, social:string, beforeValue:string):string {
        return object.type===social
            ? object.url
            : beforeValue;
    }
    
}
