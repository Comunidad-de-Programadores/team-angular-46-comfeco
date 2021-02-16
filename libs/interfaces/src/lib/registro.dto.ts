export class RegistroDto {
    readonly nombre?:string;
    readonly apellido_paterno?:string;
    readonly apellido_materno?:string;
    readonly usuario: string;
    readonly correo: string;
    readonly contrasenia: string;
    readonly terminos?: boolean = false;
}