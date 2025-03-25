import express, { Router } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cluster from 'cluster';
import process from 'process';
import { errorHandler, validationFilter } from './src/middleware/middleware.js';
import { chatbot } from './src/api/chatbot/response.js';
import { logger } from './src/helpers/logger.js';
////////////
// apenas para exemplo do body backend
// PESSIMAS PRÁTICAS: SALVANDO EM MEMÓRIA APENAS PARA EXEMPIFICAR O BODY DO BACKEND
const lastJsonBody: any = [];
///////////
const TIMEOUT = Number(process.env.REQ_TIMEOUT) || 5000;
const PORT = Number(process.env.PORT) || 8080;

const app = express();
const apiRouter = Router();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(bodyParser.json());
app.use('/v1/chat', apiRouter);

/////////////////////////
// Rota de teste
apiRouter.get('/', (req, res) => {
    chatbot({ client: { id: '999', stage: 0, message: 'Olá' } }).then((response) => {
        res.status(201).json({
            messageAlert: 'Rota Get de teste',
            data: response
        }).end();
    }).catch(() => {
        res.status(422).end();
    });
});

app.get('/', (req, res) => {
    try {
        // PESSIMAS PRÁTICAS: SALVANDO EM MEMÓRIA APENAS PARA EXEMPIFICAR O BODY DO BACKEND
        // PESSIMAS PRÁTICAS: SALVANDO EM MEMÓRIA APENAS PARA EXEMPIFICAR O BODY DO BACKEND
        res.status(201).json({
            messageAlert: 'Rota Get de teste',
            data: lastJsonBody
        }).end();
        // PESSIMAS PRÁTICAS: SALVANDO EM MEMÓRIA APENAS PARA EXEMPIFICAR O BODY DO BACKEND
    } catch (error) {
        console.error('Erro ao enviar ultimo json response:', error);
        res.status(422).end();
    }
});
/////////////////////////

apiRouter.post('/', validationFilter, (req, res) => {
    chatbot(req.body).then((response) => {
        ////////////////////////////////
        lastJsonBody.unshift(response);
        // PESSIMAS PRÁTICAS: SALVANDO EM MEMÓRIA APENAS PARA EXEMPIFICAR O BODY DO BACKEND
        ////////////////////////////////
        res.status(201).json({
            data: response
        }).end();
    }).catch(() => {
        res.status(422).end();
    });
});


/*
apiRouter.get('/:id', (req, res) => {
    findById(req.params.id).then((queryResult) => {
        const [result] = queryResult.rows;
        if (!result) {
            return res.status(404).end();
        }
        res.json(result).end();
    }).catch(() => {
        res.status(404).end();
    });
});
*/

/*
apiRouter.get('/', (req, res) => {
    if (!req.query['t']) {
        return res.status(400).end();
    }

    findByTerm(req.query.t).then((queryResults) => {
        res.json(queryResults.rows).end();
    }).catch(() => {
        res.status(404).end();
    });
});
*/
/*
app.get('/contagem-users', (_, res) => {
    count().then((queryResult) => {
        const [countResult] = queryResult.rows;
        res.json(countResult).end();
    }).catch(() => {
        res.status(422).end();
    });
});
*/

app.use(errorHandler);

const numForks = Number(process.env.CLUSTER_WORKERS) || 1;

if (cluster.isPrimary && process.env.CLUSTER === 'true') {
    logger.info(`index.js: Primary ${process.pid} is running`);

    for (let i = 0; i < numForks; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.info(`index.js: worker ${worker.process.pid} died: code ${code} signal ${signal}`);
    });
} else {
    const serverApp = app.listen(PORT, () => {
        logger.info(`index.js:${process.pid}:Listening on ${PORT}`);
    });

    if (process.env.USE_TIMEOUT === 'true') {
        serverApp.setTimeout(TIMEOUT);
        logger.info(`Starting with timeout as ${TIMEOUT}ms`);

        serverApp.on('timeout', (socket) => {
            logger.warn(`Timing out connection`);
            socket.end();
        });
    }
}

