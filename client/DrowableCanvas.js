import { setMaxListeners } from "process"

export default function DrowableCanvas(canvas, socket){
    //this function returns the THIS object automatically. it only has properties initialized with this keyword
    // this.canvas = canvas
    // //this variable will be private - only available here and not on the instance of DrawableCanvas
    // let w = "w"
    this.canDraw = false
    let previousPosition = null
    
    canvas.addEventListener('mousemove', e=>{
        //if left mouse button is not pressed, or the canvas is canDraw-false,exitthe function - no drawing
        if(e.buttons !== 1 || !this.canDraw){
            //stopped drawing: reset prevpos
            previousPosition = null
            return
        }
        //get the finish position ofdraw line on canvas
        const newPosition = { x: e.layerX, y: e.layerY}
        if(previousPosition != null){
            //draw the line
            drawLine(previousPosition, newPosition)
            //emit the drawing to the server
            socket.emit('draw', {
                start: normalizePosition(previousPosition),
                end: normalizePosition(newPosition)
            })
        }

        previousPosition = newPosition
    })
    canvas.addEventListener('mouseleave', e=>{
        previousPosition = null
    })

    //listen for somebody else draw:
    socket.on('draw-line', (start, end)=>{
        drawLine(toCanvasSpace(start), toCanvasSpace(end))
    })

    function drawLine(start, end){
        const ctx = canvas.getContext('2d')
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
    }

    //size conversion function- each user has different window size so it must be normalized
    //convert from the drawers window size to 0-1 fraction
    function normalizePosition(position){
        return {
            x: position.x / canvas.width,
            y: position.y / canvas.height,
        }
    }
    //convert from 0-1  fraction to actual width of individual user window
    function toCanvasSpace(normalizedPosition){
        return {
            x: normalizedPosition.x * canvas.width,
            y: normalizedPosition.y * canvas.height,
        }
    }
}


