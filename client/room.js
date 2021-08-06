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
const drawbleCanvas = new DrowableCanvas(canvas, socket)
const guessTemplate = document.querySelector('[data-guess-template]')

//emit event sending info to server with room id and username
socket.emit('join-room', {name: name, roomId: roomId})

socket.on('start-drawer', startRoundDrawer)
socket.on('start-guesser', startRoundGuesser)
//if anyone entered a guess, display it for everyone
socket.on('guess', displayGuess)
socket.on('winner', endRound)


//fix the canvas scaling problem
window.addEventListener('resize', resizeCanvas)

//setub buttons functionality
function setupHTMLEvents(){
    //ready button event - emit event to server and hide btn
    readyBtn.addEventListener('click', ()=>{
    hide(readyBtn)
    socket.emit('ready')
    })

    //setup gusser form submit
    guessForm.addEventListener('submit', e=>{
        e.preventDefault()
        if(guessInput.value === "") return
        //if there was something written, send it
        socket.emit('make-guess', {guess: guessInput.value})
        //display the guess on screen and person name
        displayGuess(name, guessInput.value)
        guessInput.value = ''
    })
}
//hide all UI elements except start button
endRound()
resizeCanvas()
setupHTMLEvents()

function displayGuess(guesserName, guess){
    //use the template in roomhtml to display new guess
    const guessElement = guessTemplate.content.cloneNode(true)
    const messageElement = guessElement.querySelector('[data-text]')
    const nameElement = guessElement.querySelector('[data-name]')

    nameElement.innerText = guesserName
    messageElement.innerText = guess

    messagesElement.append(guessElement)
}

function resizeCanvas(){
    //reset to css
    canvas.width = null
    canvas.height = null
    //then set them using new window size
    const clientDimenstions = canvas.getBoundingClientRect()
    canvas.width = clientDimenstions.width
    canvas.height = clientDimenstions.height
}


function endRound(name, word){
    //only if round ends with winner:
    if(name && word){
        //reveal the WORD to all
        wordElement.innerText = word
        show(wordElement)
        show(readyBtn)
        //display the winnner in the message tab:
        displayGuess(null, name + ' is the winner')
    }
    hide(guessForm)
    //no drawing possible when round ends
    drawbleCanvas.canDraw = false

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
    //reset canvas after succesful round:
    drawbleCanvas.clearCanvas()
    
    //clear old round messages
    wordElement.innerText = ''
    //unable drawing on canvas for drawer
    drawbleCanvas.canDraw = true
 }
 //guessers haw=ve the guess form available
 function startRoundGuesser(){
     //reset canvas after succesful round:
    drawbleCanvas.clearCanvas()
    hide(wordElement)
    //clear old round messages
    wordElement.innerText = ''
    
    //start new guess form
    show(guessForm)
 }