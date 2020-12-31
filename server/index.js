const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const session = require('express-session');
const flash = require('express-flash');
const cors = require('cors');
const passport = require('passport');
const initialize = require('./passportConfig');

const app = express();
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.all('/*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
//   next();
// });
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// const corsOptions = {
//   origin: 'http://localhost:3000',
// }
// app.use(cors());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    optionsSuccessStatus: 200
  })
);

const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 5000;

const botName = 'ChatCord Bot';
const router = require('./router');

io.on('connection', socket => {
  console.log('intro');

  socket.on('chatMessage', msg => {
    console.log(msg);
    socket.broadcast.emit('notifyAboutNewMessage', msg);
  });

  socket.emit('chatMessage', 'Anonym has joined to chat');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
