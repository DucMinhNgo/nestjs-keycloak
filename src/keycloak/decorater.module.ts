import { Module } from "@nestjs/common";
import { KeyCloakService } from "./keycloak.service";
import { KeyCloakStrategy } from "./keycloak.strategy";
import { KeyCloakGuard } from "./keycloak.guard";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
        HttpModule
    ],
    providers: [
        KeyCloakService,
        KeyCloakStrategy,
        KeyCloakGuard
    ]
})
export class DecoratorModule { }