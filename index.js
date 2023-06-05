const express= require('express');
const bodyParser=require('body-parser')
const app = express();

const transactionRouter = require('./src/router/transactionRouter');
const taskRouter = require('./src/router/tasksRouter');
const studentRouter = require('./src/router/studentFund');
const parentRouter = require('./src/router/parentFund');
const loginRouter = require('./src/router/login');

const PORT=5000
const IP_ADDRESS = '192.168.43.80'
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  }));
  // Set the maximum allowed size for the HTTP request payload to 50 MB



app.use('/transactions', transactionRouter);
app.use('/tasks', taskRouter);
app.use('/studentFund', studentRouter);
app.use('/parentFund', parentRouter);
app.use('/login', loginRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(PORT,IP_ADDRESS, () => {
    console.log('Server is running on port 3000');
})