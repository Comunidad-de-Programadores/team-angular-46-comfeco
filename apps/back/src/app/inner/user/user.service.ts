import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AccountType, CountryDto, EventDayDto, EventsDayDto, Gender, GenericResponse, GroupDto, GroupRequest, InsigniaDto, InsigniasDto, RecentActivitiesDto, RecentActivityDto, TechnologieDto, UserChangeInformationDto, UserDto, UserGroupDto, UsersGroupDto, UserSocialNetworksDto } from '@comfeco/interfaces';
import { UtilResponse, ValidatorService } from '@comfeco/validator';

import { UserRepository } from './user.repository';
import { JwtUtil } from '../../../util/jwt/jwt.util';
import { UserEntity } from './model/user.entity';
import { SocialNetworkEntity } from './model/social_network.entity';
import { ParametersExcepcion } from '../../../util';
import { ConfigService } from '../../../config/config.service';
import { Configuration } from '../../../config/config.keys';
import { environment } from '../../../environments/environment';
import { InsigniaUserEntity } from './model/insignia_user.entity';
import { EventDayUserDto } from './model/events_user.entity';

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

    async profileInformation(id:string, token:string): Promise<UserDto> {
        const userEntity:UserEntity = await this._userRepository.idExists(id);

        const { user, email, roles, description, birdth_date, specialities, gender, country } = userEntity;
        let genderEntity:Gender;
        
        if(gender) {
            genderEntity = await this._userRepository.informationGender(gender.prefix);
        }

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
        const insigniasEntity:InsigniaUserEntity[] = await this._userRepository.insignias(id);

        if(insigniasEntity==null) {
            return UtilResponse.genericResponse('',['El usuario no cuenta con insignias obtenidas'], HttpStatus.NOT_FOUND);
        }
        
        let insigniasTemp:InsigniaDto[] = [];
        
        insigniasEntity.forEach(insigniaUser => {
            const { insignia } = insigniaUser;
            const { name, image } = insignia;

            insigniasTemp.push({ name, image });
        });
        
        const insignias:InsigniasDto = {
            code: HttpStatus.OK,
            insignias: insigniasTemp
        }

        return insignias;
    }

    async events(id:string): Promise<EventsDayDto | GenericResponse> {
        const eventsEntity:EventDayUserDto[] = await this._userRepository.events(id);
        
        if(eventsEntity==null) {
            return UtilResponse.genericResponse('',['El usuario no tiene calendarizado ningún evento'], HttpStatus.NOT_FOUND);
        }
        
        let eventsTemp:EventDayDto[] = [];

        for(let i=0; i<eventsEntity.length; i++) {
            const eventUser:EventDayUserDto = eventsEntity[i];
            const { event } = eventUser;
            const eventEntity:EventDayDto = await this._userRepository.event(event.order);
            const { image, name, id } = eventEntity;
            eventsTemp.push({
                image,
                name,
                id
            });
        }

        const events:EventsDayDto = {
            code: HttpStatus.OK,
            events: eventsTemp
        }

        return events;
    }

    async addEvent(event:EventDayDto, id:string) {
        const saveEvent:boolean = await this._userRepository.addEvent(id, event.id);

        if(!saveEvent) {
            return UtilResponse.genericResponse('',['No puedes participar en el evento '+event.name], HttpStatus.BAD_REQUEST);
        }
        
        const userEntity:UserEntity = await this._userRepository.idExists(id);
        const insignia:InsigniaDto = await this._validateInsignia(userEntity.id);

        const events:EventsDayDto = {
            code: HttpStatus.OK,
            message: 'Te inscribiste al evento '+event.name+' de manera exitosa',
            events: [ event ],
            insignia
        }

        return events;
    }

    async leaveEvent(event:EventDayDto, id:string) {
        if(!event || !event?.id) {
            return UtilResponse.genericResponse('',['No puedes abandonar el evento '+event.name], HttpStatus.BAD_REQUEST);
        }

        const saveEvent:boolean = await this._userRepository.leaveEvent(id, event.id);

        if(!saveEvent) {
            return UtilResponse.genericResponse('',['No puedes abandonar el evento '+event.name], HttpStatus.BAD_REQUEST);
        }

        const events:EventsDayDto = {
            code: HttpStatus.ACCEPTED,
            message: 'Ya no podrás participar en el evento '+event.name,
            events: [ event ]
        }

        return events;
    }

    async recentActivity(id:string): Promise<RecentActivitiesDto | GenericResponse> {
        const eventsRegisterEntity:EventDayUserDto[] = await this._userRepository.recentEventsRegisterActivity(id);
        const eventsLeaveEntity:EventDayUserDto[] = await this._userRepository.recentEventsLeaveActivity(id);
        const insigniasObtainEntity:InsigniaUserEntity[] = await this._userRepository.recentInsigniasObtainActivity(id);
        
        if(eventsRegisterEntity.length===0 && eventsLeaveEntity.length===0 && insigniasObtainEntity.length===0) {
            return UtilResponse.genericResponse('',['No tienes actividad reciente'], HttpStatus.NOT_FOUND);
        }
        
        const eventsRegister:RecentActivityDto[] = this._eventsToActivity(eventsRegisterEntity, 'icon-comfeco-event_ok', 'Te has unido al evento: ');
        const eventsLeave:RecentActivityDto[] = this._eventsToActivity(eventsLeaveEntity, 'icon-comfeco-event_leave', 'Abandonaste el evento: ');
        const insigniasObtain:RecentActivityDto[] = this._insigniasToActivity(insigniasObtainEntity, 'icon-comfeco-insignia_ok', 'Obtuviste la insignia: ');

        const activity:RecentActivityDto[] = [
            ...eventsRegister,
            ...eventsLeave,
            ...insigniasObtain
        ];

        const recentActivity:RecentActivityDto[] = activity.sort((a, b) => (a.time < b.time) ? 1 : -1);
        
        const events:RecentActivitiesDto = {
            code: HttpStatus.OK,
            activities: recentActivity
        }

        return events;
    }

    async group(id:string): Promise<UserGroupDto | GenericResponse> {
        const userEntity:UserEntity = await this._userRepository.idExists(id);
        
        if(userEntity===null) {
            return UtilResponse.genericResponse('',['No existe el usuario'], HttpStatus.NOT_FOUND);
        }
        
        if(!userEntity?.group) {
            return UtilResponse.genericResponse('',['Aún no haces parte de ningún grupo'], HttpStatus.NOT_FOUND);
        }

        const usersByGroup:UsersGroupDto[] = await this._getUsersByGroup(userEntity.group.order);
        
        const {name:nameGroup, language} = userEntity.group;
        const languageGroup:TechnologieDto = await this._getIntoLanguage(language);
        const {name:nameLanguage, photoUrl, id:idLanguage} = languageGroup;
        
        const group:UserGroupDto = {
            code: HttpStatus.OK,
            group: {
                name:nameGroup,
                language: { name:nameLanguage, photoUrl, id:idLanguage },
                belong: true
            },
            users: usersByGroup
        }

        return group;
    }

    private async _getIntoLanguage(language:any):Promise<TechnologieDto> {
        const languageGroupRef:any = language;
        const idLanguageGroupRef:string = languageGroupRef?._path?.segments[1];
        return await this._userRepository.languageByGroup(idLanguageGroupRef);
    }

    private async _getUsersByGroup(order:number):Promise<UsersGroupDto[]> {
        const usersEntity:UserEntity[] = await this._userRepository.usersByGroup(order);
        const usersByGroup:UsersGroupDto[] = [];
        
        usersEntity.forEach((userGroup:UserEntity) => {
            const { photoUrl, user, level:levelUser } = userGroup;
            let level = levelUser;

            if(!levelUser) {
                level = 'Novato';
            }

            const hierarchy:string = this._convertHierarchyByLevel(level);

            usersByGroup.push({user, level, hierarchy, photoUrl});
        });

        return usersByGroup;
    }

    async joinGroup(idGrupo:GroupRequest, idUser:string): Promise<UserGroupDto | GenericResponse> {
        if(idGrupo===null || !idGrupo.id) {
            return UtilResponse.genericResponse('',['Es necesario enviar el id del grupo al que te deseas unir'], HttpStatus.NOT_FOUND);
        }

        const groupEntity:GroupDto = await this._userRepository.groupById(idGrupo.id);

        if(groupEntity===null || !groupEntity.active) {
            return UtilResponse.genericResponse('',['El grupo al que te deseas unir no existe o se encuentra inactivo'], HttpStatus.NOT_FOUND);
        }

        const userEntity:UserEntity = await this._userRepository.idExists(idUser);
        const belongGroup:boolean = !!userEntity.group;
        let messageError:string;
        messageError = userEntity===null ? 'No existe el usuario' : messageError;
        messageError = !messageError && belongGroup && userEntity.group?.order===groupEntity.order
                ? 'Ya eres parte del grupo '+groupEntity.name
                : messageError;
        messageError = !messageError && belongGroup && userEntity.group?.order!==groupEntity.order
                ? 'Primero necesitas abandonar el grupo en el que te encuentras para poderte unir a uno nuevo'
                : messageError;
        
        if(messageError) {
            return UtilResponse.genericResponse('',[messageError], HttpStatus.BAD_REQUEST);
        }

        const saveGroup:boolean = await this._userRepository.joinGroup(idGrupo.id, idUser);
        
        if(!saveGroup) {
            return UtilResponse.genericResponse('',['No puedes unirte al grupo '+groupEntity.name], HttpStatus.NOT_FOUND);
        }

        const insignia:InsigniaDto = await this._validateInsignia(userEntity.id);
        const usersByGroup:UsersGroupDto[] = await this._getUsersByGroup(groupEntity.order);
        const {name:nameLanguage, photoUrl } = groupEntity.language;

        const response:UserGroupDto = {
            code: HttpStatus.OK,
            message: 'Te has unido al grupo '+groupEntity.name+' de manera exitosa',
            group: {
                name:groupEntity.name,
                language: { name:nameLanguage, photoUrl },
                belong: true
            },
            users: usersByGroup,
            insignia
        }

        return response;
    }

    private async _validateInsignia(idUser:string) {
        const userEntity:UserEntity = await this._userRepository.idExists(idUser);
        const eventsEntity = await this._userRepository.allEvents(userEntity.id);
        const belongGroup:boolean = !!userEntity.group;
        const belongEvents:boolean = eventsEntity.length>0;

        let insignia:InsigniaDto;

        if(belongGroup && belongEvents) {
            insignia = await this._validInsignia(userEntity, 2);
        }

        return insignia;
    }

    async leaveGroup(idUser:string): Promise<GenericResponse> {
        const userEntity:UserEntity = await this._userRepository.idExists(idUser);

        if(userEntity===null) {
            return UtilResponse.genericResponse('',['No existe el usuario'], HttpStatus.NOT_FOUND);
        }

        if(!userEntity?.group) {
            return UtilResponse.genericResponse('',['No eres miembro de ningún grupo todavía'], HttpStatus.NOT_FOUND);
        }

        const leaveGroup:boolean = await this._userRepository.leaveGroup(idUser);
        
        if(!leaveGroup) {
            return UtilResponse.genericResponse('',['No puedes salirte del grupo en el que te encuentras'], HttpStatus.NOT_FOUND);
        }

        const response:GenericResponse = {
            code: HttpStatus.ACCEPTED,
            message: 'Saliste del grupo de manera exitosa'
        }

        return response;
    }

    private _convertHierarchyByLevel(level:string) {
        let hierarchy:string = 'Líder';

        if(level==='Novato' || level==='Medio' || level==='Apenas aprendiendo') {
            hierarchy = 'Integrante';
        }
        
        return hierarchy;
    }

    private _eventsToActivity(eventsEntity:EventDayUserDto[], type:string, activity:string) {
        let eventsActivity:RecentActivityDto[] = [];

        eventsEntity.forEach((eventUser:EventDayUserDto) => {
            const { event, register } = eventUser;

            eventsActivity.push({
                type,
                time: this._transformDate(register),
                description: activity+event.name,
            });
        });

        return eventsActivity;
    }
    
    private _insigniasToActivity(insigniasEntity:InsigniaUserEntity[], type:string, activity:string) {
        let insigniasActivity:RecentActivityDto[] = [];

        insigniasEntity.forEach((insigniaUser:InsigniaUserEntity) => {
            const { insignia, obtain } = insigniaUser;

            insigniasActivity.push({
                type,
                time: this._transformDate(obtain),
                description: activity+insignia.name,
            });
        });

        return insigniasActivity;
    }

    private _transformDate(date:any) {
        /*return {
            _seconds: parseInt(date._seconds)+5950,
            _nanoseconds: date._nanoseconds
        };*/
        return date;
    }

    async changeInformation(file:any, id:string, changeInformation:UserChangeInformationDto, token:string): Promise<UserDto | GenericResponse> {
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
        
        let insignia:InsigniaDto;
        if(await this._validFullInformation(newUser)) {
            insignia = await this._validInsignia(newUser, 1, !newUser?.insignias);
        }

        const userNewInformation:UserDto = await this.profileInformation(id, token);
        
        return {
            ...userNewInformation,
            insignia
        };
    }
    
    private async _validFullInformation(user:UserEntity) {
        if(!user.description) return false;
        if(!user.birdth_date) return false;
        if(!user.specialities) return false;
        if(!user.country) return false;
        if(!user.gender) return false;
        if(!user.modify) return false;
        
        const socialFacebook:any = await await this._userRepository.getSocialNetworkUser(user.id, 'facebook');
        const socialGithub:any = await await this._userRepository.getSocialNetworkUser(user.id, 'github');
        const socialTwitter:any = await await this._userRepository.getSocialNetworkUser(user.id, 'twitter');
        const socialLinkedin:any = await await this._userRepository.getSocialNetworkUser(user.id, 'linkedin');
        
        if(!socialFacebook) return false;
        if(!socialGithub) return false;
        if(!socialTwitter) return false;
        if(!socialLinkedin) return false;

        return true;
    }

    private async _validInsignia(user:UserEntity, numberInsignia:number, addInsignia=true) {
        let insignia:InsigniaDto;
        if(addInsignia) {
            const insigniaRef = await this._userRepository.insigniaReference(numberInsignia);
            const addInsignia:boolean = await this._userRepository.addInsigniaUser(user.id, insigniaRef);
            insignia = addInsignia && await this._userRepository.insigniaInformation(numberInsignia);
        }

        return insignia;
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
