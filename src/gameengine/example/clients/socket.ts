import { io } from 'socket.io-client';
import { ConsoleClient } from 'nefarius';
import { Method, SocketMessage } from '../socket-server-game';

const HOST = 'localhost';
const PORT = 5000;
const roomId = '2'

const consoleClient = new ConsoleClient();
// подключение с токеном
//npm run addPlayer token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb29tSWQiOiIxNiIsInVzZXJJZCI6OCwiaWF0IjoxNjk2OTU0NDE2LCJleHAiOjE2OTcwNDA4MTZ9.l_nBXF5O_cn-lPp6LjkopQSajhIm5yfeKO_ifkM8tcU"
//npm run addPlayer token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb29tSWQiOiIxNiIsInVzZXJJZCI6OSwiaWF0IjoxNjk2OTU0NDQ4LCJleHAiOjE2OTcwNDA4NDh9.Ab7G8ly5xbERafTTvgtdRcnR6dU-1NKGBFulUlkOnJI"




let token = process.argv[2].replace('token=', '')



const socket = io(`http://${HOST}:${PORT}`, {
    query: {
        token: `${token}`
    }
});

socket.on('connect', () => {
    console.log('connected');
});

socket.on('status', () => {
    console.log('status');
});

socket.on('error', (err) => {
    console.error(err);
});

socket.on('disconnect', () => {
    console.error('disconnected');
});

socket.on('data', async (data) => {
    await socketDataHandler(data);
    console.log(data);
});

async function socketDataHandler(data:any): Promise<void> {
    console.log(`Received chunk: ${data}`);

    const messages = data.split('\r');
    data = messages.pop() ?? '';
    for (const messageStr of messages) {
        const message: SocketMessage = JSON.parse(messageStr);
        await messageHandler(message);
    }
}

async function messageHandler(message: SocketMessage): Promise<void> {
    let answer;
    switch (message.method) {
        case Method.GIVE_CARDS:
            await consoleClient.giveCards(message.cards ?? []);
            await socket.emit('data', roomId, (`${JSON.stringify({ method: Method.GIVE_CARDS })}\r`));
            break;
        case Method.SET_MONEY:
            await consoleClient.setCoins(message.count ?? 0);
            await socket.emit('data', roomId, (`${JSON.stringify({ method: Method.SET_MONEY })}\r`));
            break;
        case Method.RETURN_SPY:
            answer = await consoleClient.returnSpy();
            await socket.emit('data', roomId, (`${JSON.stringify({ method: Method.RETURN_SPY, action: answer })}\r`));
            break;
        case Method.SEND_SPY:
            answer = await consoleClient.placeSpy();
            await socket.emit('data', roomId, (`${JSON.stringify({ method: Method.SEND_SPY, action: answer })}\r`));
            break;
        case Method.TAKE_OFF_CARDS:
            answer = await consoleClient.takeOffCards(message.count ?? 0);
            await socket.emit('data', roomId, (`${JSON.stringify({ method: Method.TAKE_OFF_CARDS, cardIds: answer })}\r`));
            break;
        case Method.TURN:
            answer = await consoleClient.turn();
            await socket.emit('data', roomId, (`${JSON.stringify({ method: Method.TURN, turn: answer })}\r`));
            break;
    }
}
