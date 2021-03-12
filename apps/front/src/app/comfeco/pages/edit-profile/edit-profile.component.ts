import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CountryDto, GenderDto, KnowledgeAreaDto, UserChangeInformationDto, UserDto, UserSocialNetworksDto } from '@comfeco/interfaces';
import { ValidateComponent } from '@comfeco/validator';
import { Subscription } from 'rxjs';
import { TypeAlertNotification } from '../../@theme/@components/alert-notification/alert-notification.enum';
import { HeaderService } from '../../@theme/@components/header/header.service';
import { SpinnerService } from '../../@theme/@components/spinner/spinner.service';
import { LayoutComfecoService } from '../../@theme/layout/layout-comfeco.service';
import { EditProfileService } from './edit-profile.service';

@Component({
  selector: 'comfeco-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EditProfileComponent implements OnInit, OnDestroy {

  editForm:FormGroup = this.fb.group({
    user: [],
    email: [],
    gender: [],
    birdthDate: [],
    country: [],
    password: [ , [ ValidateComponent.passwordRequired ] ],
    newPassword: [ , [ ValidateComponent.password ] ],
    confirmPassword: [ , [ ValidateComponent.matchPasswords('newPassword') ] ],
    specialities: this.fb.array([0,1,2,3,4,5,6]),
    facebook: [],
    github: [],
    linkedin: [],
    twitter: [],
    biography: [],
  });
  
  subscriptionMatchValues$:Subscription;
  subscriptionChanges$:Subscription;
  
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
  countrys:CountryDto[];
  specialities:KnowledgeAreaDto[][] = [];

  constructor(
    private fb: FormBuilder,
    private _service: EditProfileService,
    private spinner: SpinnerService,
    private _header: HeaderService,
    private notification: LayoutComfecoService,
  ) {}

  ngOnInit(): void {
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

    this._service.genders()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.genders) {
              this.genders = resp.genders;
            }
          } else {
            this.notification.alertNotification({message: resp.message});
          }
        }
      );
    
    this._service.countrys()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.country) {
              this.countrys = resp.country;
            }
          } else {
            this.notification.alertNotification({message: resp.message});
          }
        }
      );
    
    this._service.knowledgeArea()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.areas) {
              this.separeAreasForCheckbox(resp.areas);
            }
          } else {
            this.notification.alertNotification({message: resp.message});
          }
        }
      );
    
    this._service.userInformation()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.setDataFormControl(resp);
          } else {
            this.notification.alertNotification({message: resp.message});
          }
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

  setDataFormControl(resp:UserDto) {
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
      const countriesRef:any = document.getElementsByName("country");
      countriesRef.forEach((countryRef:any) => {
        if(countryRef.getAttribute("country-flag")===resp.country.flag) {
          countryRef.checked = true;
        }
      });
    }

    if(!!resp.specialities) {
      const specialitiesRef:any = document.getElementsByName("speciality");
      specialitiesRef.forEach((specialityRef:any) => {
        resp.specialities.forEach((specialityUser:any) => {
          if(specialityRef.getAttribute('area')==specialityUser) {
            specialityRef.checked = true;
          }
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptionMatchValues$.unsubscribe();
    this.subscriptionChanges$.unsubscribe();
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
    this.cleanErrors();

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

  cleanErrors() {
    this.errorUser = '';
    this.errorEmail = '';
    this.errorPassword = '';
    this.errorNewPassword = '';
    this.errorConfirmPassword = '';
  }

}
