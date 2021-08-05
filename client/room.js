import { io } from "socket.io-client";
//path to server
console.log(process.env.NODE_ENV); //will spit out  "development"

const production = process.env.NODE_ENV === 'production'
//if false, fallback to devserver:
const serverURL = production ? "realsiteurl.com" : 'http://localhost:300'

//get info from url query params IN CLIENT:
const URLparams = new URLSearchParams(window.location.search) //adresspart after'?'
const name = URLparams.get('name')
const roomId = URLparams.get('room-id')

const socket = io(serverURL)
console.log(socket);