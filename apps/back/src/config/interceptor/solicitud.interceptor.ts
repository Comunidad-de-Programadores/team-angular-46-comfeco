import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');
    
    intercept(
        ctx: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const inicio_peticion = Date.now();
        const contexto = ctx.switchToHttp();
        const respuesta = contexto.getResponse<Response>();
        const solicitud = contexto.getRequest<Request>();
        const { method:metodo, path:url, body:peticion_datos } = solicitud;

        this.logger.log(
            `${metodo} [Peticion servicio]: ${url} - ${JSON.stringify(peticion_datos)}`
        );
        
        const logCancelar = () => {
            eliminarEventos();
            log("El cliente cancela la solicitud.");
        };
        
        const logError = (error:any) => {
            eliminarEventos();
            log(error.message);
        };
        
        const logTermina = () => {
            eliminarEventos();
            log('Respuesta servicio');
        };
        
        respuesta.on("close", logCancelar);
        respuesta.on("error", logError);
        respuesta.on("finish", logTermina);
        
        const eliminarEventos = () => {
            respuesta.off("close", logCancelar);
            respuesta.off("error", logError);
            respuesta.off("finish", logTermina);
        };
        
        const escritura = respuesta.write;
        const finalizar = respuesta.end;
        
        var secciones:any[] = [];
        
        respuesta.write = (parte:any) => {
            secciones.push(Buffer.alloc(parte));
            escritura.apply(respuesta, arguments);
            return true;
        };
        
        respuesta.end = function(parte:any) {
            if (parte) {
                secciones.push(parte);
            }
            
            finalizar.apply(respuesta, arguments);
        };
        
        const log = (mensaje:string) => {
            const { statusCode:codigo } = respuesta;
            
            var respuesta_servicio = Buffer.concat(secciones).toString('utf8');
            
            if(mensaje) {
                mensaje = `[${mensaje}]: `;
            }

            this.logger.log(
                `${metodo} [${codigo} - ${Date.now() - inicio_peticion}ms] ${mensaje}${url} - ${respuesta_servicio}`
            );
        };

        return next.handle();
    }

}