import bodyParser from 'body-parser';
import express from 'express';
import userRouter from './server/routes/router';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', userRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening from port ${port}`);
});

export default app;
