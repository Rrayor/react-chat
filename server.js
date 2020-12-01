const express = require('express');
const connectDB = require('./config/db');

const app = express();

const http = require('http').createServer();
const io = require('socket.io').apply(http);
const socket_auth = require('./io/middleware/socket-auth');

//Connect to Database
connectDB();

//Init middlewares
app.use(express.json({ extended: false }));

const User = require('./models/User');
const Channel = require('./models/Channel');

app.get('/', (req, res) => res.send('API Running....'));

//Define routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/channel', require('./routes/api/channel'));

const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

io.on('connection',  async socket => {
    const auth = socket_auth(socket.token);

    if(auth.status != 200){
        return  socket.emit('error', {sender: null, message: '', status: auth.status, error: auth.message });
    }

    try {
        const user = await User.findById(socket.user.id).select('-password');

        if(!user){
            return socket.emit('error', { sender: null, message: '', status: 404, error: 'User not found' });
        }

        socket.join(socket.channel);
        socket.message = `${user.username} connected`;
        io.to(socket.channel).emit('user-connected', { sender: user, message: socket.message, status: 200, error: ''})
    } catch (error) {
        console.error(error.message);
        socket.emit({ message: '', status: 500, error: 'Server error' });
    }

    socket.on('disconnect', () => {
        io.to(socket.channel).emit('user-disconnected', { sender: socket.user, message: socket.message, stus: 200, error: '' });
    });

    socket.on('message', async ()  => {
        try {
            const channel = await Channel.findById(socket.channel);

            if(!channel){
                return socket.emit('error', { sender: null, message: '', status: 404, error: 'Channel not found' });
            }

            const{ message } = socket;

            if(!message || message == ''){
                return socket.emit('error', { sender: null, message: '', status: 400, error: 'Empty message' });
            }

            channel.messages.unshift({ user: socket.user.id, message: message });
            await channel.save();

            io.to(socket.channel).emit('message', { sender: socket.user, message: socket.message, status: 200, error: ''});
        } catch (error) {
            console.error(error.message);
            socket.emit({ message: '', status: 500, error: 'Server error' });
        }
    });
});