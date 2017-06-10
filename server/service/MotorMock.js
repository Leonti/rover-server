class MotorMock {

    forward = speed => console.log(`Motor: FORWARD with speed ${speed}`)

    back = speed => console.log(`Motor: BACK with speed ${speed}`)

    left = speed => console.log(`Motor: LEFT with speed ${speed}`)

    right = speed => console.log(`Motor: RIGHT with speed ${speed}`)

    stop = () => console.log('Motor: stop')

}

export default MotorMock
