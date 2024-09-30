import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Keycloak from 'keycloak-connect'

@Injectable()
export class KeyCloakService {
    private readonly clientsCache = new Map<string, Keycloak.Keycloak>()
    private readonly clientId: string
    private readonly clientSecret: string
    private readonly authorizationServerUrl: string

    constructor(configService: ConfigService) {
        this.clientId = configService.get('CLIENT_ID')
        this.clientSecret = configService.get('CLIENT_SECRET')
        this.authorizationServerUrl = configService.get('AUTHORIZATION_SERVER_URL')
        console.log(configService.get('CLIENT_ID'));

    }

    async validateAccessToken(realm: string, token: string): Promise<boolean> {
        const kcConfig = {
            "confidential-port": 0,
            "auth-server-url": "http://localhost:8080",
            // "auth-server-url": "http://keycloak_web:8080",
            "resource": this.clientId,
            "ssl-required": "external",
            "bearer-only": true,
            "realm": 'nest-master',
            "secret": this.clientSecret,
        }
        const keyCloak = new Keycloak({}, kcConfig)
        const tokenResult = await keyCloak.grantManager.validateAccessToken(token);

        if (typeof tokenResult === 'string') return true;
        else { throw new Error('Invalid access token'); }
    }

    // private async clientForRealm(realm: string, token: string): Promise<Keycloak.Keycloak> {
    //     const kcConfig = {
    //         "confidential-port": 8080,
    //         "auth-server-url": "http://localhost:8080",
    //         "resource": this.clientId,
    //         "ssl-required": "external",
    //         "bearer-only": true,
    //         "realm": 'nest-master',
    //         "secret": this.clientSecret,
    //     }
    //     const keyCloak = new Keycloak({}, kcConfig)

    //     console.log({ keyCloak });
    //     console.log("PASS");

    //     console.log(await keyCloak.grantManager.validateAccessToken(token));
    //     console.log("================================================================");


    //     return keyCloak;
    //     // if (!this.clientsCache.has(realm)) {
    //     //     this.clientsCache.set(
    //     //         // realm,
    //     //         // // new Keycloak.default({}, {
    //     //         // //     resource: this.clientId,
    //     //         // //     realm,
    //     //         // //     authServerUrl: this.authorizationServerUrl,
    //     //         // //     secret: this.clientSecret,
    //     //         // // } as any),
    //     //     )
    //     // }

    //     // return this.clientsCache.get(realm)
    // }

}