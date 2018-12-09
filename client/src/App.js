import React, { Component } from 'react'
import './App.css'

import Battery from './components/Battery'
import Navigation from './components/Navigation'
import CameraView from './components/CameraView'
import Rover from './components/Rover'
import MotorStats from './components/MotorStats'

import Control from './service/Control'

class App extends Component {
  state = {
      battery: null,
      temp: null,
      motorStats: null,
      speed: '10',
      cameraAngle: 50,
      wsConnected: false,
      wsError: false,
      leftTicks: 0,
      rightTicks: 0,
      ir: null,
      p: '0',
      i: '0',
      d: '0',
      ticksToGo: '2000',
  }

  control = null

  onEncoder(value) {
      if (value === 'LEFT') {
          this.setState({leftTicks: this.state.leftTicks + 1})
      } else {
          this.setState({rightTicks: this.state.rightTicks + 1})
      }
  }

  onIrSensor(value) {
      this.setState({ ir: value })
  }

  onMotorStats(value) {
    this.setState({ motorStats: value })
//    console.log(value)
//    console.log(JSON.stringify(value))
  }

  processMessage(msg) {
    if (msg.hasOwnProperty('arduino')) {
      if (msg.arduino.event.hasOwnProperty('power')) {
        console.log(msg.arduino.event.power)
        this.setState({ 
          battery: {
            voltage: msg.arduino.event.power.load_voltage,
            currentMa: msg.arduino.event.power.current_ma,
          }
         })
      } else if (msg.arduino.event.hasOwnProperty('temp')) {
        this.setState({
          temp: {
            battery: msg.arduino.event.temp.battery,
            room: msg.arduino.event.temp.room,
          }
        })
      }
    }

      switch(msg.type) {
          case 'ENCODER':
            this.onEncoder(msg.value)
            break
          case 'IR_SENSOR':
            this.onIrSensor(msg.value)
            break
          case 'BATTERY':
            this.onBattery(msg.value)
            break
          case 'TEMP':
            this.onTemp(msg.value)
            break
          case 'MOTOR_STATS':
            this.onMotorStats(msg.value)
            break
          case 'COMPASS':
            break
          case 'GYRO':
            break
          case 'AXL':
            break
          case 'BUTTON':
            break
          default:
       //     console.log('Unknown server message', msg)
      }
  }

  componentDidMount() {
//    let server = new WebSocket(`ws://${window.location.host}/ws`)
    let server = new WebSocket(`ws://192.168.0.109:5001`)
    server.onopen = () => {
        this.setState({wsConnected: true})
        this.control = new Control(server)

        server.onmessage = msg => this.processMessage(JSON.parse(msg.data))
    }
    server.onerror = err => {
      console.log('Websocket error')
      this.setState({wsError: true})
    }
    server.onclose = () => {
      console.log('closed websockets')
    }     
  }

  onSpeedChange(event) {
      this.setState({speed: event.target.value})
  }

  onPChange(event) {
      this.setState({p: event.target.value})
  }

  onIChange(event) {
      this.setState({i: event.target.value})
  }

  onDChange(event) {
      this.setState({d: event.target.value})
  }

  onTicksToGoChange(event) {
    this.setState({ticksToGo: event.target.value})
  }

  onAngleChange(event) {
    const angle = event.target.value
    this.setState({cameraAngle: angle})
    this.control.setCameraAngle(100 - angle)
  }

  onOff() {
    this.control.off()
  }

  getPid() {
    return {
      p: parseFloat(this.state.p),
      i: parseFloat(this.state.i),
      d: parseFloat(this.state.d),
    }
  }

  render() {

    const batteryView = this.state.battery != null ?
        <Battery
            battery={this.state.battery}
            batteryTemp={this.state.temp ? this.state.temp.battery : null}
        /> : null
    const navigationView = this.state.wsConnected ?
        <Navigation
            onForward={() => this.control.forward(parseInt(this.state.speed), this.getPid(), parseInt(this.state.ticksToGo))}
            onBack={() => this.control.back(parseInt(this.state.speed), this.getPid(), parseInt(this.state.ticksToGo))}
            onLeft={() => this.control.left(parseInt(this.state.speed), this.getPid())}
            onRight={() => this.control.right(parseInt(this.state.speed), this.getPid())}
            onStop={() => 1}
        /> : <div className="connecting">Connecting to rover</div>

    return (
      <div className="App">
        <h1>Rover</h1>
        <div className="control-panel">
          <CameraView />
          {navigationView}
        </div>
        {batteryView}
        <Rover
          rear={!this.state.ir ? false : this.state.ir.rear}
          left={!this.state.ir ? false : this.state.ir.left}
          front={!this.state.ir ? false : this.state.ir.front}
          right={!this.state.ir ? false : this.state.ir.right}
        />
        <div className="slider-wrapper">
          <input type="range" min="0" max="100" value={this.state.cameraAngle} onChange={this.onAngleChange.bind(this)} step="1" />
        </div>
        <div>Speed: <input type="range" min="0" max="100" value={this.state.speed} onChange={this.onSpeedChange.bind(this)} /></div>
        <div>P: <input type="text" value={this.state.p} onChange={this.onPChange.bind(this)} /></div>
        <div>I: <input type="text" value={this.state.i} onChange={this.onIChange.bind(this)} /></div>
        <div>D: <input type="text" value={this.state.d} onChange={this.onDChange.bind(this)} /></div>
        <div>Ticks to go: <input type="text" value={this.state.ticksToGo} onChange={this.onTicksToGoChange.bind(this)} /></div>
        <div>Left: {this.state.leftTicks}</div>
        <div>Right: {this.state.rightTicks}</div>
        <div>Room temperature: {this.state.temp ? this.state.temp.room : null}</div>
        <button onClick={this.onOff.bind(this)}>OFF</button>
      </div>
    );
  }
}

//         <MotorStats {...this.state.motorStats} />
export default App;
