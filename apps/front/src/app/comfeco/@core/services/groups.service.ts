import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ValidatorService } from '@comfeco/validator';
import { GenericResponse, GroupDto, GroupRequest, GroupsDto, UserGroupDto } from '@comfeco/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(
    private http: HttpClient
  ) {}
  
  allGroups() {
    return this.http.get<GroupsDto>('/groups').pipe(ValidatorService.changeBasicResponse());
  }

  groupsSearch(name:string, language:string) {
    return this.http.get<GroupsDto>(`/groups/search?name=${name}&language=${language}`).pipe(ValidatorService.changeBasicResponse());
  }

  userGroup() {
    return this.http.get<UserGroupDto>('/user/group').pipe(ValidatorService.changeBasicResponse());
  }

  joinGroup(group:GroupDto) {
    const newGroup:GroupRequest = { id: group.id };
    return this.http.post<UserGroupDto>('/user/join_group', newGroup).pipe(ValidatorService.changeBasicResponse());
  }

  leaveGroup() {
    return this.http.put<GenericResponse>('/user/leave_group', {}).pipe(ValidatorService.changeBasicResponse());
  }

}
