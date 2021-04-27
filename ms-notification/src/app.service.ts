import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IChallenge } from './interfaces/challenge.interface';
import { IPlayer } from './interfaces/player.interface';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import HTML_NOTIFICATION_OPPONENT from './static/html-notification-opponent';
import * as AWS from 'aws-sdk'

const ses =  new AWS.SES({ region: 'sa-east-1', endpoint: 'http://localhost:9001' })

@Injectable()
export class AppService {
  
  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking
  ) {}

  private readonly logger = new Logger(AppService.name)
  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()

  async sendOpponentEmail(challenge: IChallenge): Promise<void>{
    try {
      
      let idOpponent = ''
      challenge.players.map(player => {
        if(player != challenge.requester) {
          idOpponent = player
        }
      })
      const opponent: IPlayer = await this.clientAdminBackend
      .send('get-players', idOpponent)
      .toPromise()

      const requester: IPlayer = await this.clientAdminBackend
      .send('get-players', challenge.requester)
      .toPromise()

      let markup = ''
      markup = HTML_NOTIFICATION_OPPONENT
      markup = markup.replace(/#NOME_ADVERSARIO/g, opponent.name)
      markup = markup.replace(/#NOME_SOLICITANTE/g, requester.name)

      ses.sendEmail({
        Destination: { /* required */
          BccAddresses: [
           ' HTML_NOTIFICATION_OPPONENT'
          ],
          CcAddresses: [
           'test@email.com.br'
          ],
          ToAddresses: [
            opponent.email
          ]
        },
        Message: { /* required */
          Body: { /* required */
            Html: {
              Data: HTML_NOTIFICATION_OPPONENT /* required */
            },
            Text: {
              Data: 'HTML_NOTIFICATION_OPPONENT' /* required */
            }
          },
          Subject: { /* required */
            Data: 'Notificação de desafio' /* required */
          }
        },
        Source: 'SSLv3', /* required */
        ReplyToAddresses: [
          HTML_NOTIFICATION_OPPONENT
        ]
      })
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

}
