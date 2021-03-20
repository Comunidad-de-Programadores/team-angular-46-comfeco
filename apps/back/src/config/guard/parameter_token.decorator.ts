import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ParameterToken = createParamDecorator(
    (parameter:string, context:ExecutionContext) => {
        const parameters = context.switchToHttp().getRequest();
        let response:any;
        
        try {
            response = parameter ? parameters.user?.[parameter] : parameters.user;
        } catch(error) {
            response = '';
        }
        
        return response;
});