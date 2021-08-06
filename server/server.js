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

//store rooms in memory:
const rooms = {}

io.on('connection', socket =>{
    socket.on('join-room', data =>{
        console.log(data)
        //get user data:
        const user = {id: socket.id, name: data.name, socket:socket}
        let room = rooms[data.id] //get the room with current id from rooms object
        if(room == null){
            //if it does not exist in rooms, create it and store under its id key.
            room = {users: [], id: data.roomId}
            rooms[data.id] = room
        }
        //add currently connected user to this room's users array
        room.users.push(user)
        socket.join(room.id)
        console.log(room)

        //listen to ready event
        socket.on('ready', ()=>{
            user.ready = true
            if(room.users.every(u => u.ready)){
                
            }
        })

        //if user disconnects, remove him from room:
        socket.on('disconnect', () =>{
            room.users = room.users.filter(u => u !== user)
        })
    })
    
})