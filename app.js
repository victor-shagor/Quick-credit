import bodyParser from 'body-parser';
import express from 'express';
import debug from 'debug';
import userRouter from './server/routes/router';


const debugged = debug('app');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(userRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  debugged(`Listening from port ${port}`);
});

export default app;
