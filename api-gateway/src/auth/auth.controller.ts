import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthRegistryDto } from '../auth/dtos/auth-registry.dto'
import { AuthLoginDto } from './dtos/auth.login.dto';

@Controller('api/v1/auth')
export class AuthController {

    constructor (
        private awsCognitoService: AwsCognitoService
    ) {}

    @Post('/registry')
    @UsePipes(ValidationPipe)
    async registry(
        @Body() authRegistry: AuthRegistryDto
    ){
        return await this.awsCognitoService.userRegistry(authRegistry)
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    async login (
        @Body() authLoginDto: AuthLoginDto) {

            return await this.awsCognitoService.authenticateUser(authLoginDto)

    }

}
