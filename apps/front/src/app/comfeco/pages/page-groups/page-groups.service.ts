import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GenericResponse, GroupDto, GroupRequest, GroupsDto, TechnologiesDto, UserGroupDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class PageGroupsService {

  constructor(
    private http: HttpClient
  ) {}

  userGroup() {
    return this.http.get<UserGroupDto>('/user/group').pipe(ValidatorService.changeBasicResponse());
  }

  allGroups() {
    return this.http.get<GroupsDto>('/groups').pipe(ValidatorService.changeBasicResponse());
  }

  languages() {
    return this.http.get<TechnologiesDto>('/technologies').pipe(ValidatorService.changeBasicResponse());
  }
  
  joinGroup(group:GroupDto) {
    const newGroup:GroupRequest = { id: group.id };
    return this.http.post<UserGroupDto>('/user/join_group', newGroup).pipe(ValidatorService.changeBasicResponse());
  }

  leaveGroup() {
    return this.http.put<GenericResponse>('/user/leave_group', {}).pipe(ValidatorService.changeBasicResponse());
  }

  groupsByLanguge(language:string) {
    return this.http.get<GroupsDto>(`/groups/language/${language}`).pipe(ValidatorService.changeBasicResponse());
  }

  groupsByName(name:string) {
    return this.http.get<GroupsDto>(`/groups/name/${name}`).pipe(ValidatorService.changeBasicResponse());
  }

}
