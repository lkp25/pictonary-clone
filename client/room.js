import { io } from "socket.io-client";
//path to server
const socket = io('http://localhost:3000')
console.log(socket);