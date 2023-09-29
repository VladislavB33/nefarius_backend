import { Socket } from 'socket.io';
import { Method, SocketMessage } from 'src/gameengine/example/socket-server-game';
import { Action, InventionCard, Turn, User } from 'src/gameengine/types';

export class SocketPlayer implements User {
  socket: Socket
  data: string
  waitingFunction: ((answer: SocketMessage) => void) | null = null
  pendingCommand: Method | null = null

  constructor(socket: Socket) {
    this.socket = socket
    this.socket.on('data', (data) =>  this._socketDataHandler(data))
  }



  _socketDataHandler(bufer: string): void {
    let data = '' + bufer
    const messages = data.split('\r')

      data = messages.pop() ?? ''
      if (this.pendingCommand === null) {
        return
      }
      for (const messageStr of messages) {
        const message: SocketMessage = JSON.parse(messageStr)
        if (message.method === this.pendingCommand && this.waitingFunction !== null) {
          this.waitingFunction(message)
        }
      }
    }


  async waitForAnswer(method: Method): Promise<SocketMessage> {
    // Wait for another operation to complete
    while (this.waitingFunction !== null) {
      await sleep(1000)
    }
    return await new Promise((resolve) => {
      this.waitingFunction = (answer: SocketMessage) => {
        this.waitingFunction = null
        this.pendingCommand = null
        resolve(answer)
      }
      this.pendingCommand = method
    })
  }

  async giveCards(cards: InventionCard[]): Promise<void> {
    await this.socket.emit('data', (JSON.stringify({ method: Method.GIVE_CARDS, cards: cards }) + '\r'))
    await this.waitForAnswer(Method.GIVE_CARDS)
  }

  async returnSpy(): Promise<Action> {
    await this.socket.emit('data', (JSON.stringify({ method: Method.RETURN_SPY }) + '\r'))
    let answer
    do {
      answer = await this.waitForAnswer(Method.RETURN_SPY)
    } while (answer.action === undefined)
    return answer.action
  }

  async placeSpy(): Promise<Action> {
    await this.socket.emit('data', (JSON.stringify({ method: Method.SEND_SPY }) + '\r'))
    let answer
    do {
      answer = await this.waitForAnswer(Method.SEND_SPY)
    } while (answer.action === undefined)
    return answer.action
  }

  async setCoins(money: number): Promise<void> {
    await this.socket.emit('data', (JSON.stringify({ method: Method.SET_MONEY, count: money }) + '\r'))
    await this.waitForAnswer(Method.SET_MONEY)
  }

  async takeOffCards(count: number): Promise<string[]> {
    await this.socket.emit('data', (JSON.stringify({ method: Method.TAKE_OFF_CARDS, count: count }) + '\r'))
    let answer
    do {
      answer = await this.waitForAnswer(Method.TAKE_OFF_CARDS)
    } while (answer.cardIds === undefined)
    return answer.cardIds
  }

  async turn(): Promise<Turn> {
    await this.socket.emit('data', (JSON.stringify({ method: Method.TURN }) + '\r'))
    let answer
    do {
      answer = await this.waitForAnswer(Method.TURN)
    } while (answer.turn === undefined)
    return answer.turn
  }

}

async function sleep(ms: number): Promise<void> {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(), ms)
    })
  }

