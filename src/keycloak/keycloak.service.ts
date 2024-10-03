import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Keycloak from 'keycloak-connect'
import { PolicyEnforcementMode, TokenValidation } from "nest-keycloak-connect";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KeyCloakService {
    private readonly clientsCache = new Map<string, Keycloak.Keycloak>()
    private readonly clientId: string
    private readonly clientSecret: string
    private readonly authorizationServerUrl: string
    private readonly secretOrKey: string;

    constructor(
        configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.clientId = configService.get('CLIENT_ID')
        this.clientSecret = configService.get('CLIENT_SECRET')
        this.authorizationServerUrl = configService.get('KEYCLOAK_BASE_URL')
        this.secretOrKey = configService.get('KEYCLOAK_REALM_RSA_PUBLIC_KEY')
        console.log(configService.get('CLIENT_ID'));

    }

    async validateAccessToken(realm: string, token: string): Promise<boolean> {
        const kcConfig = {
            // "confidential-port": '0',
            // "auth-server-url": "http://localhost:8080",  
            "auth-server-url": this.authorizationServerUrl,
            "resource": this.clientId,
            "ssl-required": "false",
            // "bearer-only": false,
            "realm": 'nest-master',
            "secret": this.clientSecret,
            secretOrKey: this.secretOrKey,
            policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
            tokenValidation: TokenValidation.ONLINE,
        }
        console.log(kcConfig);
        // const keyCloak = new Keycloak({}, kcConfig)

        const url = `${this.authorizationServerUrl}/realms/nest-master/protocol/openid-connect/userinfo`;
        console.log(url);
        const test = await firstValueFrom(this.httpService.get(
            url,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        ));
        console.log(test);
        return true;

        // const tokenResult = await keyCloak.grantManager.validateAccessToken(token);
        // const userInfo = await keyCloak.grantManager.userInfo(token);
        // console.log(tokenResult);
        // console.log({ userInfo });



        // if (typeof tokenResult === 'string') return true;
        // else { throw new Error('Dustin Invalid access token'); }
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