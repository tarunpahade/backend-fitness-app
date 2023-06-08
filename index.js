const express= require('express');
const bodyParser=require('body-parser')
const app = express();

const transactionRouter = require('./src/router/transactionRouter');
const taskRouter = require('./src/router/tasksRouter');
const studentRouter = require('./src/router/studentFund');
const parentRouter = require('./src/router/parentFund');
const loginRouter = require('./src/router/login');
const server = require('http').createServer();
const io = require('socket.io')(server);
require('dotenv').config()

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  }));
  


io.on('connection', (socket) => {
 
  socket.on('newTask', (orderData) => {
    io.emit('newTask', orderData);
  });
  
  socket.on('TaskSentForApproval', (orderData) => {
    io.emit('TaskSentForApproval', orderData);
  });
  
});



  const PORT=5000
  const PORT2=6000

  const IP_ADDRESS = '192.168.169.253'
app.use('/transactions', transactionRouter);
app.use('/tasks', taskRouter);
app.use('/studentFund', studentRouter);
app.use('/parentFund', parentRouter);
app.use('/login', loginRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/hii', (req, res) => {
    res.send('Hello World');
})
server.listen(PORT2,IP_ADDRESS); // Replace with your desired server port

app.listen(PORT,IP_ADDRESS, () => {
    console.log('Server is running on port 3000');
})