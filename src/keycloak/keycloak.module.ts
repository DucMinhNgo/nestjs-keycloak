import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { DecoratorModule } from "./decorater.module";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), DecoratorModule],
})
export class KeyCloakModule { }