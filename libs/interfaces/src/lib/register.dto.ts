export class RegisterDto {
    readonly name?:string;
    readonly lastname?:string;
    readonly lastname_m?:string;
    readonly user: string;
    readonly email: string;
    readonly password: string;
    readonly terms?: boolean = false;
}