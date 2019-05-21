import bodyParser from 'body-parser';
import express from 'express';
import userRouter from './server/routes/router';
import loanRouter from './server/routes/loans';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', userRouter, loanRouter);
app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to quick credit' }));
app.use('*', (req, res) => res.send({ message: 'route not found' }));


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening from port ${port}`);
});

export default app;
