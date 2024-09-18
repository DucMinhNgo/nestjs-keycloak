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
        // const keyCloak = new Keycloak({}, {
        //     resource: this.clientId,
        //     realm,
        //     // authServerUrl: this.authorizationServerUrl,
        //     secret: this.clientSecret,
        // } as any);
        // const result = keyCloak.grantManager.validateAccessToken(token);
        // console.log({ result });

        const tokenResult = await this.clientForRealm(realm)?.grantManager?.validateAccessToken(token)
        console.log('tokenResult: ', tokenResult);

        if (typeof tokenResult === 'string') return true

        throw new Error('Invalid access token');
    }

    private clientForRealm(realm: string): Keycloak.Keycloak {
        // const kcConfig = {
        //     clientId: this.clientId,
        //     secret: this.clientSecret,
        //     bearerOnly: true,
        //     serverUrl: 'http://localhost:8080/auth',
        //     realm,
        //     realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsOkEbaeXjjGzzfMDE/bWFg3BnGkTe0/fOpZo5zBGAXg9krOkVOjp4M6HYHI0JsXIxiTKmYaxL1ERgTO2wMBYQXfpA6T4lPrS48qhICZoqtTDrgdsbteHeVH00eAhNjgznwLze38WorT3MNHgJLlfwgOtiASDmW+cc1xP7EFTZyeGeUYbjj9R/ytEzOhyDZgtftrN2bVGiiUHTxJAGBFQ7MT8JRfxvqYS8CBUcBTNJXHSvBuhgj1B+ZbhV1e3YigJNSMvlPIoFOjkYnpUjGlYN73HMmjgX6MpefL8X6nQJg6aS2bPMx8yOtuhnlS3JfBIkEPw+Fo17CXyn/1aNGkYQQIDAQAB',
        //     'confidential-port': 3000,
        //     'auth-server-url': 'http://localhost:8080/auth',
        //     'resource': 'nodejs',
        //     'ssl-required': 'external',
        //     "public-client": true,
        //     verifyTokenAudience: true
        // };
        const kcConfig = {
            "realm": 'nest-master',
            "auth-server-url": "http://localhost:8080/auth/",
            "ssl-required": "external",
            "resource": this.clientId,
            "verify-token-audience": true,
            "credentials": {
                "secret": this.clientSecret
            },
            "use-resource-role-mappings": true,
            "confidential-port": 0,
            "policy-enforcer": {},
            "CLIENT_ID": this.clientId,
            "GRANT_TYPE": "client_credentials",
            "bearer-only": true,
            "public-client": true,
            realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsOkEbaeXjjGzzfMDE/bWFg3BnGkTe0/fOpZo5zBGAXg9krOkVOjp4M6HYHI0JsXIxiTKmYaxL1ERgTO2wMBYQXfpA6T4lPrS48qhICZoqtTDrgdsbteHeVH00eAhNjgznwLze38WorT3MNHgJLlfwgOtiASDmW+cc1xP7EFTZyeGeUYbjj9R/ytEzOhyDZgtftrN2bVGiiUHTxJAGBFQ7MT8JRfxvqYS8CBUcBTNJXHSvBuhgj1B+ZbhV1e3YigJNSMvlPIoFOjkYnpUjGlYN73HMmjgX6MpefL8X6nQJg6aS2bPMx8yOtuhnlS3JfBIkEPw+Fo17CXyn/1aNGkYQQIDAQAB'
        }
        const keyCloak = new Keycloak({}, kcConfig)

        console.log({ keyCloak });


        return keyCloak;
        // if (!this.clientsCache.has(realm)) {
        //     this.clientsCache.set(
        //         // realm,
        //         // // new Keycloak.default({}, {
        //         // //     resource: this.clientId,
        //         // //     realm,
        //         // //     authServerUrl: this.authorizationServerUrl,
        //         // //     secret: this.clientSecret,
        //         // // } as any),
        //     )
        // }

        // return this.clientsCache.get(realm)
    }

}