import { setMaxListeners } from "process"

export default function DrowableCanvas(canvas, socket){
    //this function returns the THIS object automatically. it only has properties initialized with this keyword
    // this.canvas = canvas
    // //this variable will be private - only available here and not on the instance of DrawableCanvas
    // let w = "w"
    let previousPosition = null
    
    canvas.addEventListener('mousemove', e=>{
        //if left mouse button is not pressed, exitthe function - no drawing
        if(e.buttons !== 1){
            //stopped drawing: reset prevpos
            previousPosition = null
            return
        }
        //get the finish position ofdraw line on canvas
        const newPosition = { x: e.layerX, y: e.layerY}
        if(previousPosition != null){
            //draw the line
            drawLine(previousPosition, newPosition)
        }

        previousPosition = newPosition
    })

    function drawLine(start, end){
        const ctx = canvas.getContext('2d')
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
    }

}


