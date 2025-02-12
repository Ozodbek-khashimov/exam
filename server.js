import express from 'express';
import { apiRouter } from './routes/index.js';
import { connectDB } from './config/db.js';


const app = express();
const port = process.env.PORT || 1111;

app.use(express.json());

await connectDB()

app.use('/static', express.static('uploads'));

app.use((req, res, next) => {
  console.time('middleware');
  console.log({
    method: req.method,
    url: req.url,
    body:req.body
  });

  next();
  console.timeEnd('middleware');
});

app.use('/api', apiRouter);



app.listen(port, () => {
  console.log(`Server running on port : http://localhost:${port}`);
});