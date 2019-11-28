import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';
import { move } from './battlesnake';

const PORT = 3000;
const app  = express();

app.set('port', PORT);
app.enable('verbose errors');
app.use(logger('dev'));
app.use(bodyParser.json());

app.post('/start', (_, response) => {
    return response.json({
        headType: 'regular',
        tailType: 'regular',
        color: '#FF0000',
    })
});

app.post('/move', (request, response) => {
    // NOTE: Do something here to generate your move
    return response.json({
        move: move(request.body as any),
    })
});

app.post('/end', (_, response) => {
    // NOTE: Any cleanup when a game is complete.
    return response.json({});
});

app.post('/ping', (_, response) => {
    // Used for checking if this snake is still alive.
    return response.json({});
});

app.listen(PORT, () => {
    console.log('Server listening on port %s', PORT)
});