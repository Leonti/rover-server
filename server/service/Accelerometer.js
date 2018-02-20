const ADXL345 = require('adxl345-sensor')

class Accelerometer {

    callbacks = []

    constructor() {
      this.adxl345 = new ADXL345()
      this.adxl345.init()
        .then(() => {
          console.log('ADXL345 initialization succeeded');
          this.getAcceleration();
        })
        .catch((err) => console.error(`ADXL345 initialization failed: ${err} `));
    }

    getAcceleration = () => {
      this.adxl345.getAcceleration(true) // true for g-force units, else false for m/s²
        .then((acceleration) => {
          console.log(`acceleration = ${JSON.stringify(acceleration, null, 2)}`);
          setTimeout(this.getAcceleration, 50);
        })
        .catch((err) => {
          console.log(`ADXL345 read error: ${err}`);
          setTimeout(this.getAcceleration, 500);
        })
    }

    onData = onData => this.callbacks.push(onData)
}

export default Accelerometer
