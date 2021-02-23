import { TechnologieDto } from './technologie_response.dto';

export class ExhibitorDto {
    readonly technologies: TechnologieDto[];
    readonly name: string;
    readonly photoUrl?: string;
}