import { Socket } from 'socket.io';
import { Method, SocketMessage } from 'src/gameengine/example/socket-server-game';
import { Action, InventionCard, Turn } from 'src/gameengine/types';

export class SocketPlayer  {
  socket: Socket
  data: string
  waitingFunction: ((answer: SocketMessage) => void) | null = null
  pendingCommand: Method | null = null

  constructor(socket: Socket, data: string) {
    this.socket = socket
    this._socketDataHandler(data)
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

// client <ref *1> Socket {
//     _events: [Object: null prototype] {
//       disconnect: [ [Function: handler], [Function (anonymous)] ],
//       register: [Function: handler]
//     },
//     _eventsCount: 2,
//     _maxListeners: undefined,
//     nsp: <ref *2> Namespace {
//       _events: [Object: null prototype] { connection: [Function (anonymous)] },
//       _eventsCount: 1,
//       _maxListeners: undefined,
//       sockets: Map(1) { '3w-86wiCt7FapEf6AAAB' => [Circular *1] },
//       _fns: [],
//       _ids: 0,
//       server: Server {
//         _events: [Object: null prototype] {},
//         _eventsCount: 0,
//         _maxListeners: undefined,
//         _nsps: [Map],
//         parentNsps: Map(0) {},
//         parentNamespacesFromRegExp: Map(0) {},
//         _path: '/socket.io',
//         clientPathRegex: /^\/socket\.io\/socket\.io(\.msgpack|\.esm)?(\.min)?\.js(\.map)?(?:\?|$)/,
//         _connectTimeout: 45000,
//         _serveClient: true,
//         _parser: [Object],
//         encoder: [Encoder],
//         opts: [Object],
//         _adapter: [class Adapter extends EventEmitter],
//         sockets: [Circular *2],
//         eio: [Server],
//         httpServer: [Server],
//         engine: [Server],
//         [Symbol(kCapture)]: false
//       },
//       name: '/',
//       adapter: Adapter {
//         _events: [Object: null prototype] {},
//         _eventsCount: 0,
//         _maxListeners: undefined,
//         nsp: [Circular *2],
//         rooms: [Map],
//         sids: [Map],
//         encoder: [Encoder],
//         [Symbol(kCapture)]: false
//       },
//       [Symbol(kCapture)]: false
//     },
//     client: Client {
//       sockets: Map(1) { '3w-86wiCt7FapEf6AAAB' => [Circular *1] },
//       nsps: Map(1) { '/' => [Circular *1] },
//       server: Server {
//         _events: [Object: null prototype] {},
//         _eventsCount: 0,
//         _maxListeners: undefined,
//         _nsps: [Map],
//         parentNsps: Map(0) {},
//         parentNamespacesFromRegExp: Map(0) {},
//         _path: '/socket.io',
//         clientPathRegex: /^\/socket\.io\/socket\.io(\.msgpack|\.esm)?(\.min)?\.js(\.map)?(?:\?|$)/,
//         _connectTimeout: 45000,
//         _serveClient: true,
//         _parser: [Object],
//         encoder: [Encoder],
//         opts: [Object],
//         _adapter: [class Adapter extends EventEmitter],
//         sockets: [Namespace],
//         eio: [Server],
//         httpServer: [Server],
//         engine: [Server],
//         [Symbol(kCapture)]: false
//       },
//       conn: Socket {
//         _events: [Object: null prototype],
//         _eventsCount: 3,
//         _maxListeners: undefined,
//         id: 'FlfOeO1t9GltlMr2AAAA',
//         server: [Server],
//         upgrading: false,
//         upgraded: false,
//         _readyState: 'open',
//         writeBuffer: [],
//         packetsFn: [],
//         sentCallbackFn: [],
//         cleanupFn: [Array],
//         request: [IncomingMessage],
//         protocol: 4,
//         remoteAddress: '::ffff:127.0.0.1',
//         checkIntervalTimer: null,
//         upgradeTimeoutTimer: null,
//         pingTimeoutTimer: Timeout {
//           _idleTimeout: 45000,
//           _idlePrev: [TimersList],
//           _idleNext: [TimersList],
//           _idleStart: 4868,
//           _onTimeout: [Function (anonymous)],
//           _timerArgs: undefined,
//           _repeat: null,
//           _destroyed: false,
//           [Symbol(refed)]: true,
//           [Symbol(kHasPrimitive)]: false,
//           [Symbol(asyncId)]: 75,
//           [Symbol(triggerId)]: 58
//         },
//         pingIntervalTimer: Timeout {
//           _idleTimeout: 25000,
//           _idlePrev: [TimersList],
//           _idleNext: [TimersList],
//           _idleStart: 2742,
//           _onTimeout: [Function (anonymous)],
//           _timerArgs: undefined,
//           _repeat: null,
//           _destroyed: false,
//           [Symbol(refed)]: true,
//           [Symbol(kHasPrimitive)]: false,
//           [Symbol(asyncId)]: 67,
//           [Symbol(triggerId)]: 0
//         },
//         transport: [WebSocket],
//         [Symbol(kCapture)]: false
//       },
//       encoder: Encoder { replacer: undefined },
//       decoder: Decoder { reviver: undefined, _callbacks: [Object] },
//       id: 'FlfOeO1t9GltlMr2AAAA',
//       onclose: [Function: bound onclose],
//       ondata: [Function: bound ondata],
//       onerror: [Function: bound onerror],
//       ondecoded: [Function: bound ondecoded],
//       connectTimeout: undefined
//     },
//     recovered: false,
//     data: {},
//     connected: true,
//     acks: Map(0) {},
//     fns: [],
//     flags: {},
//     server: <ref *3> Server {
//       _events: [Object: null prototype] {},
//       _eventsCount: 0,
//       _maxListeners: undefined,
//       _nsps: Map(1) { '/' => [Namespace] },
//       parentNsps: Map(0) {},
//       parentNamespacesFromRegExp: Map(0) {},
//       _path: '/socket.io',
//       clientPathRegex: /^\/socket\.io\/socket\.io(\.msgpack|\.esm)?(\.min)?\.js(\.map)?(?:\?|$)/,
//       _connectTimeout: 45000,
//       _serveClient: true,
//       _parser: {
//         protocol: 5,
//         PacketType: [Object],
//         Encoder: [class Encoder],
//         Decoder: [class Decoder extends Emitter]
//       },
//       encoder: Encoder { replacer: undefined },
//       opts: { cleanupEmptyChildNamespaces: false },
//       _adapter: [class Adapter extends EventEmitter],
//       sockets: <ref *2> Namespace {
//         _events: [Object: null prototype],
//         _eventsCount: 1,
//         _maxListeners: undefined,
//         sockets: [Map],
//         _fns: [],
//         _ids: 0,
//         server: [Circular *3],
//         name: '/',
//         adapter: [Adapter],
//         [Symbol(kCapture)]: false
//       },
//       eio: Server {
//         _events: [Object: null prototype],
//         _eventsCount: 1,
//         _maxListeners: undefined,
//         middlewares: [],
//         clients: [Object],
//         clientsCount: 1,
//         opts: [Object],
//         ws: [WebSocketServer],
//         [Symbol(kCapture)]: false
//       },
//       httpServer: Server {
//         maxHeaderSize: undefined,
//         insecureHTTPParser: undefined,
//         requestTimeout: 300000,
//         headersTimeout: 60000,
//         keepAliveTimeout: 5000,
//         connectionsCheckingInterval: 30000,
//         _events: [Object: null prototype],
//         _eventsCount: 5,
//         _maxListeners: undefined,
//         _connections: 1,
//         _handle: [TCP],
//         _usingWorkers: false,
//         _workers: [],
//         _unref: false,
//         allowHalfOpen: true,
//         pauseOnConnect: false,
//         noDelay: true,
//         keepAlive: false,
//         keepAliveInitialDelay: 0,
//         httpAllowHalfOpen: false,
//         timeout: 0,
//         maxHeadersCount: null,
//         maxRequestsPerSocket: 0,
//         _connectionKey: '6::::7000',
//         [Symbol(IncomingMessage)]: [Function: IncomingMessage],
//         [Symbol(ServerResponse)]: [Function: ServerResponse],
//         [Symbol(kCapture)]: false,
//         [Symbol(async_id_symbol)]: 54,
//         [Symbol(http.server.connections)]: ConnectionsList {},
//         [Symbol(http.server.connectionsCheckingInterval)]: Timeout {
//           _idleTimeout: 30000,
//           _idlePrev: [TimersList],
//           _idleNext: [TimersList],
//           _idleStart: 1555,
//           _onTimeout: [Function: bound checkConnections],
//           _timerArgs: undefined,
//           _repeat: 30000,
//           _destroyed: false,
//           [Symbol(refed)]: false,
//           [Symbol(kHasPrimitive)]: false,
//           [Symbol(asyncId)]: 53,
//           [Symbol(triggerId)]: 0
//         },
//         [Symbol(kUniqueHeaders)]: null
//       },
//       engine: Server {
//         _events: [Object: null prototype],
//         _eventsCount: 1,
//         _maxListeners: undefined,
//         middlewares: [],
//         clients: [Object],
//         clientsCount: 1,
//         opts: [Object],
//         ws: [WebSocketServer],
//         [Symbol(kCapture)]: false
//       },
//       [Symbol(kCapture)]: false
//     },
//     adapter: <ref *4> Adapter {
//       _events: [Object: null prototype] {},
//       _eventsCount: 0,
//       _maxListeners: undefined,
//       nsp: <ref *2> Namespace {
//         _events: [Object: null prototype],
//         _eventsCount: 1,
//         _maxListeners: undefined,
//         sockets: [Map],
//         _fns: [],
//         _ids: 0,
//         server: [Server],
//         name: '/',
//         adapter: [Circular *4],
//         [Symbol(kCapture)]: false
//       },
//       rooms: Map(1) { '3w-86wiCt7FapEf6AAAB' => [Set] },
//       sids: Map(1) { '3w-86wiCt7FapEf6AAAB' => [Set] },
//       encoder: Encoder { replacer: undefined },
//       [Symbol(kCapture)]: false
//     },
//     id: '3w-86wiCt7FapEf6AAAB',
//     handshake: {
//       headers: {
//         'sec-websocket-version': '13',
//         'sec-websocket-key': '5hulWUN2q9EzFWMIyy+7Rw==',
//         connection: 'Upgrade',
//         upgrade: 'websocket',
//         'sec-websocket-extensions': 'permessage-deflate; client_max_window_bits',
//         host: 'localhost:7000'
//       },
//       time: 'Mon May 01 2023 19:38:44 GMT+0300 (Москва, стандартное время)',
//       address: '::ffff:127.0.0.1',
//       xdomain: false,
//       secure: false,
//       issued: 1682959124139,
//       url: '/socket.io/?EIO=4&transport=websocket',
//       query: [Object: null prototype] { EIO: '4', transport: 'websocket' },
//       auth: {}
//     },
//     [Symbol(kCapture)]: false
//   }
  