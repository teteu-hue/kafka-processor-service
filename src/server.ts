import express, { Router, Request, Response, Application } from 'express';

const app: Application = express();
const route: Router = Router();

app.use(express.json());

app.use(route);

export { route, app }
