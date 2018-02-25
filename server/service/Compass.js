const HMC5883L = require('compass-hmc5883l')

class Compass {

    callbacks = []

    constructor() {
      this.compass = new HMC5883L(1)
      this.getCompass()
    }

    getCompass = () => {
      this.compass.getRawValues((err, values) => {

        if (err) {
          console.log(`Compass read error: ${err}`);
          setTimeout(this.getCompass, 500);
        } else {
          this.callbacks.forEach(c => c(values))
          setTimeout(this.getCompass, 50);
        }
      })
    }

    onData = onData => this.callbacks.push(onData)
}

export default Compass
