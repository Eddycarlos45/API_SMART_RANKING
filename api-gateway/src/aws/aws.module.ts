import { Module } from '@nestjs/common';
import { AwsCognitoConfig } from './aws-cognito.config'
import { AwsCognitoService } from './aws-cognito.service'

@Module({
  providers: [ AwsCognitoConfig, AwsCognitoService],
  exports: [ AwsCognitoConfig, AwsCognitoService]
})
export class AwsModule {}
