import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const IdUser = createParamDecorator(
    (_, context:ExecutionContext) => {
        const parameters = context.switchToHttp().getRequest();
        let response:any;
        
        try {
            response = parameters.user?.id;
        } catch(error) {
            response = '';
        }
        
        return response;
});