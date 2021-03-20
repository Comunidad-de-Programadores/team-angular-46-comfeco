import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

import { SpinnerService } from '@comfeco/api';
import { GroupDto, GroupsDto, TechnologieDto, UserGroupDto } from '@comfeco/interfaces';

import { TypeAlertNotification } from '../../@theme/@components/alert-notification/alert-notification.enum';
import { InsigniaType } from '../../@theme/@components/insignia/insignia.enum';
import { InsigniaService } from '../../@theme/@components/insignia/insignia.service';
import { Modal } from '../../@theme/@components/modal/modal.interface';
import { LayoutComfecoService } from '../../@theme/layout/layout-comfeco.service';
import { PageTabsProfileService } from '../tabs-profile/page-tabs-profile.service';
import { LanguagesService } from '../../@core/services/languages.service';
import { GroupsService } from '../../@core/services/groups.service';

@Component({
  selector: 'comfeco-page-groups',
  templateUrl: './page-groups.component.html',
  styleUrls: ['./page-groups.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageGroupsComponent implements OnInit, OnDestroy {

  groupForm:FormGroup = this.fb.group({
    language: [],
    search: [],
  });

  myGroup$:Subject<UserGroupDto> = new Subject();
  myGroupMessage$:Subject<string> = new Subject();
  allGroups$:Subject<GroupDto[]> = new Subject();

  userGroup:UserGroupDto;
  userGroupError:string;
  allGroups: GroupDto[];
  technologies: TechnologieDto[];
  idModal:number;

  modalSubscription$:Subscription;
  myGroupSubscription$:Subscription;
  myGroupMessageSubscription$:Subscription;
  allGroupsSubscription$:Subscription;
  languagesSubscription$:Subscription;

  constructor(
    private fb: FormBuilder,
    private _serviceProfile: PageTabsProfileService,
    private _languagesService: LanguagesService,
    private _groupsService: GroupsService,
    private notification: LayoutComfecoService,
    private spinner: SpinnerService,
    private insignia: InsigniaService
  ) { }

  ngOnInit(): void {
    this.formReset();
    this.formChanges();

    this.subscriptionMyGroup();
    this.subscriptionMyGroup();
    this.subscriptionAllGroups();
    
    this.completeMyGroup();
    this.completeGroups();
    this.completeLanguages();
    this.subscribeModalConfirm();
  }

  ngOnDestroy() {
    this.modalSubscription$?.unsubscribe();
    this.myGroupSubscription$?.unsubscribe();
    this.myGroupMessageSubscription$?.unsubscribe();
    this.allGroupsSubscription$?.unsubscribe();
    this.languagesSubscription$?.unsubscribe();
  }
  
  formReset() {
    this.groupForm.reset({
      language: '-1',
      search: ''
    });
  }

  formChanges() {
    this.spinner.show();
    this._groupsService.userGroup()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.userGroup = resp;
          } else {
            this.userGroupError = resp.message;
          }
          this.spinner.hidde();
        }
      );

    this.spinner.show();
    this.groupForm.get('language')?.valueChanges
      .subscribe( language => {
        this.spinner.show();
        const search:string = this.groupForm.get('search').value;
        this._groupsService.groupsSearch(search, language)
          .subscribe((resp:any) => this.refreshGroups(resp));
    });
    
    this.spinner.show();
    this.groupForm.get('search')?.valueChanges
      .subscribe( search => {
        this.spinner.show();
        const language:string = this.groupForm.get('language').value;
        this._groupsService.groupsSearch(search, language)
          .subscribe((resp:any) => this.refreshGroups(resp));
    });
  }

  refreshGroups(resp:GroupsDto) {
    if(resp.success) {
      this.allGroups$.next(resp.groups);
    } else {
      this.notification.alertNotification({message: resp.message});
    }
    
    this.spinner.hidde();
  }

  subscriptionMyGroup() {
    this.myGroupSubscription$ = this.myGroup$.subscribe(groupChanged => {
      this.spinner.show();
      this.userGroup = groupChanged;
      this.userGroupError = '';
      if(this.userGroup===null) {
        this.userGroupError = 'Aún no haces parte de ningún grupo';
      }
      this.spinner.hidde();
    });

    this.myGroupMessageSubscription$ = this.myGroupMessage$.subscribe(messageGroupChanged => {
      this.userGroupError = messageGroupChanged;
    });
  }

  subscriptionAllGroups() {
    this.allGroupsSubscription$ = this.allGroups$.subscribe(groupsChanged => {
      this.spinner.show();
      this.allGroups = groupsChanged;
      this.spinner.hidde();
    });
  }

  completeMyGroup() {
    this.spinner.show();
    this._groupsService.userGroup()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.userGroup = resp;
          } else {
            this.userGroupError = resp.message;
          }
          this.spinner.hidde();
        }
      );
  }

  completeGroups() {
    this.spinner.show();
    this._groupsService.allGroups()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.allGroups = resp.groups;
          } else {
            this.notification.alertNotification({message: resp.message});
          }
          this.spinner.hidde();
        }
      );
  }

  completeLanguages() {
    this.spinner.show();
    this.languagesSubscription$ = this._languagesService.languages()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.technologies = resp.technologies;
          } else {
            this.notification.alertNotification({message: resp.message});
          }
          this.spinner.hidde();
        }
      );
  }

  subscribeModalConfirm() {
    this.modalSubscription$ = this.notification.modalConfirm$.subscribe((confirm:Modal) => {
      if(confirm.id===this.idModal && confirm.confirm) {
        this.spinner.show();
        this._groupsService.leaveGroup().subscribe(
          (resp:any) => {
            if(resp.success) {
              this.changeParticipationGroups(false);
              this.myGroup$.next(null);
              this.myGroupMessage$.next('Aún no haces parte de ningún grupo');
            }

            this.notification.alertNotification({message: resp.message, type: resp.success ? TypeAlertNotification.SUCCESS: TypeAlertNotification.ERROR});
            this.spinner.hidde();
          }
        );
      }
    });
  }

  onLeaveMyGroup(leave:boolean) {
    if(leave) {
      this.idModal = this.notification.modal({
        title:'Abandonar Grupo',
        message:'¿Estás seguro de que deseas abandonar el grupo?',
      });
    }
  }

  onJoinGroup(group:GroupDto) {
    this.spinner.show();
    this._groupsService.joinGroup(group)
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.myGroup$.next(resp);
            this.changeParticipationGroups(true);
          }
          
          if(resp.success && !!resp.insignia) {
            this.insignia.show(InsigniaType.DYNAMIC);
            const { name, image } = resp.insignia;
            this._serviceProfile.userInsignias$.next([{name, image, complete:true}]);
          }

          this.notification.alertNotification({message: resp.message, type: resp.success ? TypeAlertNotification.SUCCESS: TypeAlertNotification.ERROR});
          this.spinner.hidde();
        }
      );
  }

  onLeaveGroup(group:GroupDto) {
    this.onLeaveMyGroup(group!==null);
  }

  changeParticipationGroups(belong:boolean) {
    let newGroups:GroupDto[] = [];
    const nameGroup:string = this.userGroup.group.name;
    this.allGroups.forEach((group:GroupDto) => {
      let newGroup:GroupDto;
      const belongGroup = group.name===nameGroup && belong;
      newGroup = { ...group, belong: belongGroup };
      newGroups.push(newGroup);
    });
    this.allGroups$.next(newGroups);
  }

}
