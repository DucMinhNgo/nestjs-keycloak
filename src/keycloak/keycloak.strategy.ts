import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-http-bearer'
import { KeyCloakService } from "./keycloak.service";

@Injectable()
export class KeyCloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
    constructor(private readonly keyCloakService: KeyCloakService) {
        super({ passReqToCallback: true })
    }

    async validate(req: any, token: string): Promise<boolean> {
        // try {
        console.log('KeyCloakStrategy');
        const type = req.protectionType as string
        const realm = this.realmFromToken(token)

        console.log(realm);
        console.log(token);
        await this.keyCloakService.validateAccessToken(realm, token)


        return true;
        // } catch (error) {
        //     Logger.debug(`Invalid token message=${error.message}`, KeyCloakStrategy.name)

        //     if (req.isRest) return false

        //     throw new Error(error.message);
        // }
    }

    private realmFromToken(token: string): string {
        try {
            const [, payload] = token.split('.')

            const data = JSON.parse(Buffer.from(payload, 'base64').toString())

            return data.iss.substring(data.iss.lastIndexOf('/') + 1)
        } catch (error) {
            throw new Error('Invalid token')
        }
    }
}
