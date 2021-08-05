const io = require('socket.io')(3000, 
    //options 
    {
        cors: {
            //add client url so it is not blocked
            origin: 'http://localhost:1234'
        }
    }
)
io.on('connection', socket =>{
    console.log('here');
})