import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: 'keycloak_web:8080/auth',
      realm: 'nest-master',
      clientId: 'nest-client',
      secret: 'secret',
      // optional if you want to retrieve JWT from cookie
      cookieKey: 'KEYCLOAK_JWT',
      // available on Realm Settings -> Keys -> RS256. then click "Public Key" button ;-)
      realmPublicKey:
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArTgJ9uu6fCXAeNlPqb28BCAB05BcWZy1QUwB2sMsK6tRThPQ8gOUE62m/MVsIOlfEClETmKKipcSAuLnqDHIE8RZ9uYhA+sv2VQnzZCjxcS5aOWVkWJhjospMNK7vSMkfrPP9DpkLK+B+/ArXL9zb5gjs8/oQSLATu5enS1s1TLl91mrdNo1u+P0twplnDSbTkjI6qUdNpBLiH0s7dD9cHB9p0lU4gHb+VnrJ6qNqEuBgXJwrP8iAGYYqeiCAbcpWRIcPoBZE5HXrAM+CK5kVcroccgE8X3e9Z90taSW6MbhhpFXeva+ZO6j7ikCqFjJnziqdcw6+UpiG8rNmA8FAwIDAQAB',
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    // These are in order, see https://docs.nestjs.com/guards#binding-guards
    // for more information

    // This adds a global level authentication guard, you can also have it scoped
    // if you like.
    //
    // Will return a 401 unauthorized when it is unable to
    // verify the JWT token or Bearer header is missing.
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // This adds a global level resource guard, which is permissive.
    // Only controllers annotated with @Resource and methods with @Scopes
    // are handled by this guard.
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    // New in 1.1.0
    // This adds a global level role guard, which is permissive.
    // Used by `@Roles` decorator with the optional `@AllowAnyRole` decorator for allowing any
    // specified role passed.
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    AppService
  ],
})
export class AppModule { }
