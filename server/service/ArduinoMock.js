class ArduinoMock {

  constructor() {
    this.batteryListeners = []

    setInterval(() => {
        this.batteryListeners.forEach(c => c({
          voltage: 7.64,
          current_mA: 400
        }))
    }, 2000)
  }

  onBattery(listener) {
    this.batteryListeners.push(listener)
  }

  setAngle(percentage) {
    console.log(`Setting angle to ${percentage}`)
  }
}

export default ArduinoMock
