import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';

const PORT = 80;
const app  = express();

app.set('port', PORT);
app.enable('verbose errors');
app.use(logger('dev'));
app.use(bodyParser.json());

app.post('/start', (request, response) => {
    // NOTE: Do something here to start the game
    return response.json({
        color: '#DFFF00',
    })
});

app.post('/move', (request, response) => {
    // NOTE: Do something here to generate your move
    return response.json({
        move: 'down', // one of: ['up','down','left','right']
    })
});

app.post('/end', (request, response) => {
    // NOTE: Any cleanup when a game is complete.
    return response.json({});
});

app.post('/ping', (request, response) => {
    // Used for checking if this snake is still alive.
    return response.json({});
});

app.listen(PORT, () => {
    console.log('Server listening on port %s', PORT)
});