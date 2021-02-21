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
        const startPetition = Date.now();
        const context = ctx.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const { method, path:url, body } = request;

        this.logger.log(
            `${method} [Peticion servicio]: ${url} - ${JSON.stringify(body)}`
        );
        
        const logCancel = () => {
            deleteEvents();
            log("El cliente cancela la solicitud.");
        };
        
        const logError = (error:any) => {
            deleteEvents();
            log(error.message);
        };
        
        const logTerminate = () => {
            deleteEvents();
            log('Respuesta servicio');
        };
        
        response.on("close", logCancel);
        response.on("error", logError);
        response.on("finish", logTerminate);
        
        const deleteEvents = () => {
            response.off("close", logCancel);
            response.off("error", logError);
            response.off("finish", logTerminate);
        };
        
        const write = response.write;
        const end = response.end;
        
        var chuncks:any[] = [];
        
        response.write = (parte:any) => {
            chuncks.push(Buffer.alloc(parte));
            write.apply(response, arguments);
            return true;
        };
        
        response.end = function(parte:any) {
            if (parte) {
                chuncks.push(parte);
            }
            
            end.apply(response, arguments);
        };
        
        const log = (message:string) => {
            const { statusCode:code } = response;
            
            var responseService = Buffer.concat(chuncks).toString('utf8');
            
            if(message) {
                message = `[${message}]: `;
            }

            this.logger.log(
                `${method} [${code} - ${Date.now() - startPetition}ms] ${message}${url} - ${responseService}`
            );
        };

        return next.handle();
    }

}