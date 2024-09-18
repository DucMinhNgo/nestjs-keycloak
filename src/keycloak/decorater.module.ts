import { Module } from "@nestjs/common";
import { KeyCloakService } from "./keycloak.service";
import { KeyCloakStrategy } from "./keycloak.strategy";
import { KeyCloakGuard } from "./keycloak.guard";

@Module({
    providers: [
        KeyCloakService,
        KeyCloakStrategy,
        KeyCloakGuard
    ]
})
export class DecoratorModule { }