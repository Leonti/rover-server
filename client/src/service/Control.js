
const move = (speed, direction) => {
    return {
        type: 'MOVE',
        value: {
            speed: speed,
            direction: direction
        }
    }
}

class Control {

    constructor(ws) {
        this.ws = ws
    }

    forward = speed => this.ws.send(JSON.stringify(move(speed, 'FORWARD')))
    back = speed => this.ws.send(JSON.stringify(move(speed, 'BACK')))
    left = speed => this.ws.send(JSON.stringify(move(speed, 'LEFT')))
    right = speed => this.ws.send(JSON.stringify(move(speed, 'RIGHT')))
    stop = () => this.ws.send(JSON.stringify({
        type: 'STOP'
    }))

}

export default Control
