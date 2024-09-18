import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from '@nestjs/core';
// import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class KeyCloakGuard extends AuthGuard('keycloak') {
    constructor(private readonly reflector: Reflector) {
        super()
    }

    getRequest(context: ExecutionContext): any {
        console.log("KeyCloakGuard");
        // const isRest = context.getType() === 'http'

        // const request = isRest
        //     ? context.switchToHttp().getRequest()
        //     : GqlExecutionContext.create(context).getContext().req

        const request = context.switchToHttp().getRequest();

        return request;
    }
}