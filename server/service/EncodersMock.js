class EncodersMock {

    onLeftCallbacks = []
    onRightCallbacks = []

    constructor() {

        setInterval(() => {
            this.onLeftCallbacks.forEach(c => c())
            this.onRightCallbacks.forEach(c => c())
        }, 100)
    }

    onLeftTick = onLeft => this.onLeftCallbacks.push(onLeft)

    onRightTick = onRight => this.onRightCallbacks.push(onRight)

}

export default EncodersMock
