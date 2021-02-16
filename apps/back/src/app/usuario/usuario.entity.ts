import { Estatus, Rol, TipoCuenta } from "@comfeco/interfaces";

export interface UsuarioEntidad {
    nombre?:string;
    apellido_paterno?:string;
    apellido_materno?:string;
    correo?: string,
    contrasenia?: string,
    roles?: Rol[];
    estatus?: Estatus,
    tipo?: TipoCuenta,
    idFacebook?:string,
    tokenFaceook?:string,
    tokenGoogle?:string,
    tokenApi?:string,
    usuario?:string
}