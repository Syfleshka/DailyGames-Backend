import express, { Request, Response } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { body, validationResult } from 'express-validator';

import pool from './config/db';
import routes from './routes';

const app = express();

app.use(
    cors({
        credentials: true,
    })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database', err.stack);
    } else {
        console.log('Connected to the database:', res.rows);
    }
});

app.use(express.json());

app.post(
    '/users',
    body('email').isEmail(),
    body('name').notEmpty(),
    // @ts-ignore
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    routes
);

app.use('/api', routes);

app.use((err: any, req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
