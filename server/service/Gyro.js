const Gyroscope = require('gyroscope-itg3200')

class Gyro {

    callbacks = []

    constructor() {
      this.gyro = new Gyroscope(1)
      this.getGyro()
    }

    getGyro = () => {
      this.gyro.getValues((err, values) => {

        if (err) {
          console.log(`Gyro read error: ${err}`);
          setTimeout(this.getGyro, 500);
        } else {
          this.callbacks.forEach(c => c(values))
          setTimeout(this.getGyro, 50);
        }
      })
    }

    onData = onData => this.callbacks.push(onData)
}

export default Gyro
