import 'reflect-metadata'
import express, { Express } from 'express'
import 'express-async-errors'
import { routes } from '../../routes'
import '../containers'
import dbConnection from '../../database/mongo/mongoConfigs'
import cors from 'cors'
import cluster from 'cluster';
import { errorHandler } from '../../middlewares/validate';
import { logger } from '../../helpers/logger'

const TIMEOUT = Number(process.env.REQ_TIMEOUT) || 5000;
const PORT = process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 8080) : 9999;

interface CustomExpress extends Express {
  mongo?: any
}

// Configurações
const app: CustomExpress = express()

app.mongo = dbConnection
app.use(express.json())
app.use(cors())

// Rotas
app.use(routes);


app.get('/', async (req: any, res: any) => {
  try {
    res.status(200).send(`<h1>Servidor rodando na porta ${PORT}</h1>`)
  } catch (err) {
    res.status(500).send('<h1>Falha ao iniciar o servidor</h1>', err)
  }
})

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

