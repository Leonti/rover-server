class MotorMock {

    constructor() {
        this.test = 'test'
    }

    forward = speed => console.log(`Motor: FORWARD with speed ${speed} ${this.test}`)

    back = speed => console.log(`Motor: BACK with speed ${speed}`)

    left = speed => console.log(`Motor: LEFT with speed ${speed}`)

    right = speed => console.log(`Motor: RIGHT with speed ${speed}`)

    stop = () => console.log('Motor: stop')

}

export default MotorMock
