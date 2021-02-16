import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';

import { Estatus, Rol, TipoCuenta, RegistroDto } from '@comfeco/interfaces';

import { UsuarioEntidad } from './usuario.entity';

@Injectable()
export class UsuarioRepository {

    private _coleccion:string = 'usuarios';

    async validarExistenciaUsuario(usuario:string): Promise<UsuarioEntidad> {
        const db = admin.firestore();
        const usuariosBase = db.collection(this._coleccion);
        const usuarioBase = await usuariosBase.doc(usuario).get();
        
        if(!usuarioBase.exists) {
           return null;
        }

        return usuarioBase.data();
    }
    
    async validarExistenciaCorreo(correo:string): Promise<UsuarioEntidad> {
        const db = admin.firestore();
        const correoBase = await db.collection(this._coleccion).where('correo', '==', correo).get();
        const correosRegistrados:any[] = [];
        
        correoBase.forEach(doc => {
            correosRegistrados.push(doc.data());
        });
        
        if(correosRegistrados.length==0) {
            return null;
        }
        
        return correosRegistrados[0];
    }

    async validarExistenciaTipoCorreo(correo:string): Promise<UsuarioEntidad> {
        const db = admin.firestore();
        const correoBase = await db.collection(this._coleccion)
                                    .where('correo', '==', correo)
                                    .where('tipo', '==', TipoCuenta.CORREO)
                                    .get();

        const correosRegistrados:any[] = [];
        
        correoBase.forEach(doc => {
            correosRegistrados.push(doc.data());
        });
        
        if(correosRegistrados.length==0) {
            return null;
        }
        
        return correosRegistrados[0];
    }

    async validarExistenciaTokenCambioContrasenia(token:string): Promise<UsuarioEntidad> {
        const db = admin.firestore();
        const tokenBase = await db.collection(this._coleccion).where('tokenApi', '==', token).get();
        const coleccionesEncontradas:any[] = [];
        
        tokenBase.forEach(doc => {
            coleccionesEncontradas.push(doc.data());
        });
        
        if(coleccionesEncontradas.length==0) {
            return null;
        }

        return coleccionesEncontradas[0];
    }

    async registrarUsuarioCorreo(registroDto: RegistroDto, tokenApi:string): Promise<void> {
        const { usuario, correo, contrasenia } = registroDto;

        const base = admin.firestore();
        const registro = base.collection(this._coleccion).doc(usuario);
        
        const passwordCifrado = await bcrypt.hash(contrasenia, 10);
        
        const { nombre='', apellido_paterno='', apellido_materno='' } = registroDto;
        
        const entidad:UsuarioEntidad = {
            usuario,
            nombre,
            apellido_paterno,
            apellido_materno,
            correo,
            contrasenia: passwordCifrado,
            roles: [ Rol.INVITADO ],
            estatus: Estatus.ACTIVO,
            tipo: TipoCuenta.CORREO,
            tokenApi
        }

        await registro.set(entidad);
    }

    async registrarUsuarioRedSocial(cuenta:UsuarioEntidad): Promise<void> {
        const base = admin.firestore();
        const documento = base.collection(this._coleccion).doc(cuenta.usuario);
        
        const entidad: UsuarioEntidad = {
            roles: [ Rol.INVITADO ],
            estatus: Estatus.ACTIVO,
            usuario:cuenta.usuario,
            ...cuenta
        };
        
        await documento.set(entidad);
    }

    async actualizarTokenUsuario(usuarioDetalle:UsuarioEntidad): Promise<void> {
        await admin.firestore().collection(this._coleccion).doc(usuarioDetalle.usuario).update(usuarioDetalle);
    }
    
}
