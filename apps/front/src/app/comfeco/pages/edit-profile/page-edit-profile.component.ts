import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SpinnerService } from '@comfeco/api';
import { AccountType, CountryDto, GenderDto, KnowledgeAreaDto, UserChangeInformationDto, UserDto, UserSocialNetworksDto } from '@comfeco/interfaces';
import { ValidateComponent } from '@comfeco/validator';

import { TypeAlertNotification } from '../../@theme/@components/alert-notification/alert-notification.enum';
import { HeaderService } from '../../@theme/@components/header/header.service';
import { InsigniaType } from '../../@theme/@components/insignia/insignia.enum';
import { InsigniaService } from '../../@theme/@components/insignia/insignia.service';
import { LayoutComfecoService } from '../../@theme/layout/layout-comfeco.service';

import { PageTabsProfileService } from '../tabs-profile/page-tabs-profile.service';
import { PageEditProfileService } from './page-edit-profile.service';
import { KnowledgeAreaService } from '../../@core/services/knowledge-area.service';
import { CountrysService } from '../../@core/services/countrys.service';
import { GendersService } from '../../@core/services/genders.service';

@Component({
  selector: 'comfeco-page-edit-profile',
  templateUrl: './page-edit-profile.component.html',
  styleUrls: ['./page-edit-profile.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageEditProfileComponent implements OnInit, OnDestroy {

  editForm:FormGroup = this.fb.group({
    user: [],
    email: [],
    gender: [],
    birdthDate: [],
    country: [],
    password: [ , [ ValidateComponent.password ] ],
    newPassword: [ , [ ValidateComponent.password ] ],
    confirmPassword: [ , [ ValidateComponent.matchPasswords('newPassword') ] ],
    specialities: this.fb.array([0,1,2,3,4,5,6]),
    facebook: [],
    github: [],
    linkedin: [],
    twitter: [],
    biography: [],
  });
  
  user:UserDto;

  subscriptionMatchValues$:Subscription;
  subscriptionChanges$:Subscription;
  userInformationSubscription$:Subscription;
  knowledgeAreaSubscription$:Subscription;
  allKnowledgeAreaSubscription$:Subscription;
  countriesSubscription$:Subscription;
  gendersSubscription$:Subscription;

  errorUser:string;
  errorEmail:string;
  errorPassword:string;
  errorNewPassword:string;
  errorConfirmPassword:string;

  file:any;
  newBirdthDate:string = '';
  imageSrc:string|ArrayBuffer;
  numberCharactersBiography:number;

  genders:GenderDto[];
  countries:CountryDto[];
  specialities:KnowledgeAreaDto[][] = [];
  allSpecialities:KnowledgeAreaDto[] = [];

  constructor(
    private fb: FormBuilder,
    private _serviceProfile: PageTabsProfileService,
    private _knowledgeAreaService: KnowledgeAreaService,
    private _countrysService: CountrysService,
    private _gendersService: GendersService,
    private _service: PageEditProfileService,
    private spinner: SpinnerService,
    private _header: HeaderService,
    private notification: LayoutComfecoService,
    private insignia: InsigniaService
  ) {}

  ngOnInit(): void {
    this.subscriptionForm();
    this.subscriptionUserInformation();
    this.completeGenders();
    this.completeCountries();
    this.completeKnowledgeAreas();
  }

  ngOnDestroy(): void {
    this.subscriptionMatchValues$?.unsubscribe();
    this.subscriptionChanges$?.unsubscribe();
    this.userInformationSubscription$?.unsubscribe();
    this.knowledgeAreaSubscription$?.unsubscribe();
    this.allKnowledgeAreaSubscription$?.unsubscribe();
    this.countriesSubscription$?.unsubscribe();
    this.gendersSubscription$?.unsubscribe();
  }

  subscriptionForm() {
    this.editForm.reset({
      country: '',
      password: ''
    });

    this.subscriptionMatchValues$ = ValidateComponent.subscriptionMatchValues(this.editForm, 'newPassword', 'confirmPassword');

    this.subscriptionChanges$ = this.editForm.valueChanges.subscribe(({ birdthDate, biography }) => {
      if(birdthDate) {
        this.newBirdthDate = this._service.parseDate(birdthDate);
      }

      if(biography) {
        this.numberCharactersBiography = 140-biography.length;
      }
    });
  }

  subscriptionUserInformation() {
    this.userInformationSubscription$ = this._serviceProfile.userInformation$.subscribe(userChanged => {
      this.spinner.show();
      this.completeAllKnowledgeAreas(userChanged);
      
      this.user = userChanged;
      this.spinner.hidde();
    });
  }

  completeGenders() {
    this.spinner.show();
    this.gendersSubscription$ = this._gendersService.genders()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.genders) {
              this.genders = resp.genders;
            }
          } else {
            this.notification.alertNotification({message: resp.message});
          }
          this.spinner.hidde();
        }
      );
  }

  completeCountries() {
    this.spinner.show();
    this.countriesSubscription$ = this._countrysService.countrys()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.country) {
              this.countries = resp.country;
            }
          } else {
            this.notification.alertNotification({message: resp.message});
          }
          this.spinner.hidde();
        }
      );
  }

  completeKnowledgeAreas() {
    this.spinner.show();
    this.knowledgeAreaSubscription$ = this._knowledgeAreaService.knowledgeArea()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.areas) {
              this.separeAreasForCheckbox(resp.areas);
            }
          } else {
            this.notification.alertNotification({message: resp.message});
          }
          this.spinner.hidde();
        }
      );
  }

  completeAllKnowledgeAreas(dataUser:UserDto) {
    this.spinner.show();
    this.allKnowledgeAreaSubscription$ = this._knowledgeAreaService.knowledgeArea()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(!!resp.areas) {
              const allSpecialities = [];
              resp.areas.forEach((area:KnowledgeAreaDto) => {
                allSpecialities.push(area.area);
              });
              this.setDataFormControl(dataUser, allSpecialities);
            }
          } else {
            this.notification.alertNotification({message: resp.message});
          }
          this.spinner.hidde();
        }
      );
  }

  separeAreasForCheckbox(areas:KnowledgeAreaDto[]) {
    let specialitiesSection:KnowledgeAreaDto[] = [];
    let counter:number=0;
    let counterAreas:number=0;

    if(!!areas) {
      areas.forEach((area:KnowledgeAreaDto) => {
        if(counter==4) {
          this.specialities.push(specialitiesSection);
          specialitiesSection = [];
          counter = 0;
        }
        specialitiesSection.push({...area, element: counterAreas });
        counter++;
        counterAreas++;
      });

      this.specialities.push(specialitiesSection);
    }
  }

  setDataFormControl(resp:UserDto, specialities:string[]) {
    const birdthDate:any = resp?.birdth_date;
    const date:string = !!birdthDate && this._service.formatDate(parseInt(birdthDate._seconds)*1000);
    
    this.imageSrc = resp.photoUrl;
    this.editForm.controls['user'].setValue(resp.user);
    this.editForm.controls['email'].setValue(resp.email);
    this.editForm.controls['birdthDate'].setValue(date);
    this.editForm.controls['facebook'].setValue(resp.social_networks?.facebook);
    this.editForm.controls['github'].setValue(resp.social_networks?.github);
    this.editForm.controls['linkedin'].setValue(resp.social_networks?.linkedin);
    this.editForm.controls['twitter'].setValue(resp.social_networks?.twitter);
    this.editForm.controls['biography'].setValue(resp.description);
    this.editForm.controls['gender'].setValue(resp.gender.id);
    
    if(!!resp?.country?.flag) {
      this.countries?.forEach((country, index) => {
        if(country.flag===resp.country.flag) {
          this.editForm.controls['country'].setValue(index);
        }
      });
    }
    
    if(!!resp.specialities) {
      const controlsSpecialities:any = this.editForm.controls['specialities'];
      const areas:any = resp.specialities;
      specialities.forEach((speciality, index)=>{
        controlsSpecialities.controls[index].setValue(areas.includes(speciality));
      });
    }
  }

  readURL(event:any): void {
    if (event.target.files && event.target.files[0]) {
      const fileRead = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(fileRead);
      this.file = fileRead;
    }
  }
  
  editInformation() {
    this._cleanErrors();

    if((this.user.typeAccount===AccountType.EMAIL || this.user.edit) &&
        this.editForm.controls?.password?.value==='') {
      this.errorPassword = 'La contraseña es requerida';
      return;
    }
    
    if(this.user.typeAccount!==AccountType.EMAIL && !this.user.edit && this.editForm.controls?.newPassword?.value===null) {
      this.errorNewPassword = 'La contraseña es requerida';
      return;
    }

    if(this.editForm.invalid) {
      this.errorPassword = this.editForm.controls?.password?.errors?.error[0];
      this.errorNewPassword = this.editForm.controls?.newPassword?.errors?.error[0];
      this.errorConfirmPassword = this.editForm.controls?.confirmPassword?.errors?.error[0];
      return;
    }

    this.spinner.show();

    const information:UserChangeInformationDto = this.setChangeInformation();
    
    this._service.editProfile(information, this.file)
      .subscribe((resp:any) => {
        if(resp.success) {
          this._header.changeUser(resp.user);
          this._header.changePhoto(resp.photoUrl);
          this.notification.alertNotification({
            message: 'Información de perfil actualizada correctamente',
            type: TypeAlertNotification.SUCCESS
          });
          this._serviceProfile.userInformation$.next(resp);
          this.showInsignia(resp);
        } else {
          const message:string = resp.message;
          if(message.indexOf('Usuario')>-1) {
            this.errorUser = 'Cambiar por un usuario diferente';
          }
          
          if(message.indexOf('Correo')>-1) {
            this.errorEmail = 'Correo asociado a otra cuenta';
          }
          
          this.notification.alertNotification({message});
        }
        
        this.spinner.hidde();
      });
  }

  setChangeInformation() {
    const {
      user, email, gender, birdthDate,
      password, newPassword,
      facebook, github, linkedin, twitter,
      biography
    } = this.editForm.value;

    const countrysRef:any = document.getElementsByName("country");
    let countryName:string;
    let countryFlag:string;

    countrysRef.forEach((countryRef:any) => {
      if(countryRef.checked) {
        countryName = countryRef.getAttribute("country-name");
        countryFlag = countryRef.getAttribute("country-flag");
      }
    });

    let specialities:string[] = [];
    const specialitiesRef:any = document.getElementsByName("speciality");
    specialitiesRef.forEach((specialityRef:any) => {
      if(specialityRef.checked) {
        specialities.push(specialityRef.value);
      }
    });

    const countryInfo:CountryDto = { flag: countryFlag, name: countryName };
    const socialNetworks:UserSocialNetworksDto = {
      facebook, github, twitter, linkedin
    };

    return {
      user, email, gender,
      birdth_date: birdthDate,
      country: countryInfo,
      password,
      password_new: newPassword,
      description: biography,
      specialities,
      social_networks: socialNetworks
    } as UserChangeInformationDto;
  }

  showInsignia(user:UserDto) {
    if(!!user?.insignia) {
      this.insignia.show(InsigniaType.SOCIABLE);
      const { name, image } = user.insignia;
      this._serviceProfile.userInsignias$.next([{name, image, complete:true}]);
    }
  }

  returnUserInformation() {
    let editRef:HTMLElement = document.getElementById('myProfile') as HTMLElement;
    editRef.click();
    const newUser:UserDto = {
      ...this.user,
      photoUrl: `${this.user.photoUrl}&id=${(new Date()).getTime()}`
    }
    this._serviceProfile.userInformation$.next(newUser);
  }

  private _cleanErrors() {
    this.errorUser = '';
    this.errorEmail = '';
    this.errorPassword = '';
    this.errorNewPassword = '';
    this.errorConfirmPassword = '';
  }

}
