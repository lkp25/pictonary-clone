//true or false production?
const production = process.env.NODE_ENV === 'production'
//if false, fallbeck to devserver:
const clientURL = production ? "realsiteurl.com" : 'http://localhost:1234'

const io = require('socket.io')(3000, 
    //options 
    {
        cors: {
            //add client url so it is not blocked
            origin: clientURL
        }
    }
)
io.on('connection', socket =>{
    console.log('here');
})