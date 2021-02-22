import { TechnologieDto } from './technologie.dto';

export class ExhibitorDto {
    readonly technologies: TechnologieDto[];
    readonly name: number;
    readonly photoUrl?: number;
}