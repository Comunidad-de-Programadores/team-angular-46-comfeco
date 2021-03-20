import { GenericResponse } from "./generic_response.dto";
import { RecentActivityDto } from "./recent_activity_response.dto";

export class RecentActivitiesDto extends GenericResponse {
    readonly activities: RecentActivityDto[];
}