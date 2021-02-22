import { GenericResponse } from "./generic_response.dto";
import { SponsorDto } from "./sponsor.dto";

export class SponsorsDto extends GenericResponse {
    readonly sponsors: SponsorDto[];
}