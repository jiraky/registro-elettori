import App from '@/app';
import cors from 'cors';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import VotersRoute from '@routes/voters.route';
import validateEnv from '@utils/validateEnv';
import {ORIGIN} from '@config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import errorMiddleware from '@middlewares/error.middleware';

validateEnv();

const app = new App([new UsersRoute(), new AuthRoute(), new VotersRoute()]);

app.listen();


const express = require('express')
const http_app = express()

http_app.use(cors({ origin: ORIGIN}));
http_app.use(hpp());
http_app.use(helmet());
http_app.use(compression());
http_app.use(express.json());
http_app.use(express.urlencoded({ extended: true }));
http_app.use(cookieParser());
http_app.use(errorMiddleware);

http_app.get('*', function(req, res) {  
    res.redirect('https://registro.ingegneri.vr.it' + req.url);
})

http_app.listen(80)

const https_app = express()
https_app.use(cors({ origin: ORIGIN}));
https_app.use(compression());
https_app.use(express.json());
https_app.use(express.urlencoded({ extended: true }));
https_app.use(cookieParser());
https_app.use(errorMiddleware);

const fs = require('fs');
const path = require('path')
https_app.use('/', cors(), express.static(path.join(__dirname, 'pages')))
require('https')
  .createServer(
    {
      // ...
      cert: fs.readFileSync('/etc/ssl/certs/registro.ingegneri.vr.it.pem'),
      key: fs.readFileSync('/etc/ssl/private/registro.ingegneri.vr.it.key'),
      // ...
    },
    https_app
  )
  .listen(443);