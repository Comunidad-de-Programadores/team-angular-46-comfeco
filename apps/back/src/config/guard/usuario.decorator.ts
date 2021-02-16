import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ParametroToken = createParamDecorator(
    (parametro:string, contexto:ExecutionContext) => {
        const parametros = contexto.switchToHttp().getRequest();
        let respuesta:any;
        
        try {
            respuesta = parametro ? parametros.user?.[parametro] : parametros.user;
        } catch(error) {
            respuesta = '';
        }
        
        return respuesta;
});