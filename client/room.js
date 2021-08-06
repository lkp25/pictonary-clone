import { io } from "socket.io-client";
import DrowableCanvas from "./DrowableCanvas"
//path to server
console.log(process.env.NODE_ENV); //will spit out  "development"

const production = process.env.NODE_ENV === 'production'
//if false, fallback to devserver:
const serverURL = production ? "realsiteurl.com" : 'http://localhost:3000'

//get info from url query params IN CLIENT:
const URLparams = new URLSearchParams(window.location.search) //adresspart after'?'
const name = URLparams.get('name')
const roomId = URLparams.get('room-id')

//no room name or id in query? redirect to homepage
if(!name || !roomId){
    window.location = "index.html"
}

const socket = io(serverURL)
console.log(socket);

//get the fields in the room:
const guessForm = document.querySelector('[data-guess-form]')
const guessInput = document.querySelector('[data-guess-input]')
const wordElement = document.querySelector('[data-word]')
const messagesElement = document.querySelector('[data-messages]')
const readyBtn = document.querySelector('[data-ready-btn]')
const canvas = document.querySelector('[data-canvas]')
console.log(canvas);
const drawbleCanvas = new DrowableCanvas(canvas, socket)

//emit event sending info to server with room id and username
socket.emit('join-room', {name: name, roomId: roomId})

socket.on('start-drawer', startRoundDrawer)
socket.on('start-guesser', startRoundGuesser)

//ready button event - emit event to server and hide btn
readyBtn.addEventListener('click', ()=>{
    hide(readyBtn)
    socket.emit('ready')
})

//hide all UI elements except start button
endRound()
function endRound(){
    hide(guessForm)
}
function hide(element){
    element.classList.add('hide')
}
function show(element){
    
    element.classList.remove('hide')
}

//functions for start drawer and guesser
//drower has the word printed on screen
 function startRoundDrawer(word){
    wordElement.innerText = word
 }
 //guessers haw=ve the guess form available
 function startRoundGuesser(){
    show(guessForm)
 }