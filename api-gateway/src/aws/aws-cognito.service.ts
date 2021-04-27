import { Injectable } from "@nestjs/common";

import { 
    CognitoUserPool,
    CognitoUserAttribute, 
    CognitoUser,
    AuthenticationDetails
} from 'amazon-cognito-identity-js'
import { AuthRegistryDto } from "src/auth/dtos/auth-registry.dto";
import { AuthLoginDto } from "src/auth/dtos/auth.login.dto";
import { AwsCognitoConfig } from './aws-cognito.config'

@Injectable()
export class AwsCognitoService {

    private userPool: CognitoUserPool

    constructor( 
        private authConfig: AwsCognitoConfig
    ) {

        this.userPool = new CognitoUserPool({
            UserPoolId: this.authConfig.userPoolId,
            ClientId: this.authConfig.clientId
        })

    }

    async userRegistry (authRegistryDto: AuthRegistryDto) {

        const { name, email, password, phoneNumber } = authRegistryDto

        return new Promise((resolve, reject) => {
            this.userPool.signUp(
                email,
                password,
                [
                    new CognitoUserAttribute({
                        Name: 'phone_number', Value: phoneNumber
                    }),
                    new CognitoUserAttribute({
                        Name: 'name', Value: name
                    })                
                ], null,
                (err, result) => {
                    if (!result) {
                        reject(err)
                    } else {
                        resolve(result.user)
                    }
                }
            )
        })
    }


    async authenticateUser(authLoginDto: AuthLoginDto) {

        const { email, password } =  authLoginDto

        const userData = {
            Username: email,
            Pool: this.userPool
        }

        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        })

        const userCognito = new CognitoUser(userData)

        return new Promise((resolve, reject) => {
            userCognito.authenticateUser(authenticationDetails, {

                onSuccess: (result) => {
                    resolve(result)
                },
                onFailure: ((err) => {
                    reject(err)
                })

            })

        })

    }
    


}
