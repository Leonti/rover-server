import React, { PureComponent } from 'react'
import './App.css'

import Battery, { BatteryStats } from './components/Battery'
import Navigation from './components/Navigation'
import { MotorStats, Stat, Stats } from './components/MotorStats'
import CameraView from './components/CameraView'

import Control from './service/Control'

type Temp = {
  battery: number,
  room: number,
}

type State = {
  battery?: BatteryStats,
  temp?: Temp,
  speed: string,
  cameraAngle: number,
  wsConnected: boolean,
  wsError: boolean,
  leftTicks: number,
  rightTicks: number,
  p: string,
  i: string,
  d: string,
  ticksToGo: string,
  motorStats?: Stats
}

const toStat = (wsStat: any): Stat => {
  return {
    speedBase: wsStat.speed_base,
    speedSlave: wsStat.speed_slave,
    ticksBase: wsStat.ticks_base,
    ticksSlave: wsStat.ticks_slave,
    error: wsStat.error,
    pTerm: wsStat.p_term,
    iTerm: wsStat.i_term,
    dTerm: wsStat.d_term,
  }
}

const toStats = (wsStats: any): Stats => {
  return {
    p: wsStats.p,
    i: wsStats.i,
    d: wsStats.d,
    stats: wsStats.stats.map(toStat)
  }
}

class App extends PureComponent<{}, State> {

  constructor(props: any){
    super(props)
    this.state = {
      speed: localStorage.getItem('speed') !== null ? localStorage.getItem('speed')! : '10',
      cameraAngle: 50,
      wsConnected: false,
      wsError: false,
      leftTicks: 0,
      rightTicks: 0,
      p: localStorage.getItem('p') !== null ? localStorage.getItem('p')! : '0',
      i: localStorage.getItem('i') !== null ? localStorage.getItem('i')! : '0',
      d: localStorage.getItem('d') !== null ? localStorage.getItem('d')! : '0',
      ticksToGo: localStorage.getItem('ticksToGo') !== null ? localStorage.getItem('ticksToGo')! : '2000'
    }
  }

  control?: Control = undefined

  onEncoder(value: string) {
      if (value === 'LEFT') {
          this.setState({leftTicks: this.state.leftTicks + 1})
      } else {
          this.setState({rightTicks: this.state.rightTicks + 1})
      }
  }

  processMessage(msg: any) {
    if (msg.hasOwnProperty('arduino')) {
      if (msg.arduino.event.hasOwnProperty('power')) {
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
    } else if (msg.hasOwnProperty('encoder')) {
      /*
      if (msg.encoder.event.wheel === 'left') {
        this.setState({leftTicks: this.state.leftTicks + 1})
      } else {
        this.setState({rightTicks: this.state.rightTicks + 1})
      }
      */
    } else if (msg.hasOwnProperty('generic')) {

    } else if (msg.hasOwnProperty('motorrunstats')) {
      this.setState({
        motorStats: toStats(msg.motorrunstats)
      })
    } else {
      console.log(msg)
    }
    /*
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
      */
  }

  componentDidMount() {
//    let server = new WebSocket(`ws://${window.location.host}/ws`)
    let server = new WebSocket(`ws://192.168.0.110:5001`)
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

  onSpeedChange(event: React.ChangeEvent<HTMLInputElement>) {
      this.setState({speed: event.target.value})
      localStorage.setItem('speed', event.target.value)
  }

  onPChange(event: React.ChangeEvent<HTMLInputElement>) {
      this.setState({p: event.target.value})
      localStorage.setItem('p', event.target.value)
  }

  onIChange(event: React.ChangeEvent<HTMLInputElement>) {
      this.setState({i: event.target.value})
      localStorage.setItem('i', event.target.value)
  }

  onDChange(event: React.ChangeEvent<HTMLInputElement>) {
      this.setState({d: event.target.value})
      localStorage.setItem('d', event.target.value)
  }

  onTicksToGoChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ticksToGo: event.target.value})
    localStorage.setItem('ticksToGo', event.target.value)
  }

  onAngleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const angle = parseInt(event.target.value)
    this.setState({cameraAngle: angle})
    if (this.control) {
      this.control.setCameraAngle(100 - angle)
    }
  }

  onOff() {
    if (this.control) {
      this.control.off()
    }
  }

  onGo(direction: string) {
    console.log('going ' + direction)
    if (this.control) {
      this.setState({
        leftTicks: 0,
        rightTicks: 0,
      })

      this.control.go(parseInt(this.state.speed), this.getPid(), parseInt(this.state.ticksToGo), direction)
    }
  }

  getPid() {
    return {
      p: parseFloat(this.state.p),
      i: parseFloat(this.state.i),
      d: parseFloat(this.state.d),
    }
  }

  render() {
//    console.log('render')
    const batteryView = this.state.battery !== undefined && this.state.temp ?
        <Battery
            battery={this.state.battery}
            batteryTemp={this.state.temp.battery}
        /> : null
    const navigationView = this.state.wsConnected && this.control ?
        <Navigation
            onForward={() => this.control!.forward(parseInt(this.state.speed), this.getPid(), parseInt(this.state.ticksToGo))}
            onBack={() => this.control!.back(parseInt(this.state.speed), this.getPid(), parseInt(this.state.ticksToGo))}
            onLeft={() => this.control!.left(parseInt(this.state.speed), this.getPid(), parseInt(this.state.ticksToGo))}
            onRight={() => this.control!.right(parseInt(this.state.speed), this.getPid(), parseInt(this.state.ticksToGo))}
            onStop={() => 1}
        /> : <div className="connecting">Connecting to rover</div>


    const statsView = this.state.motorStats !== undefined ?
      <MotorStats stats={this.state.motorStats} /> : null

    return (
      <div className="App">
        <h1>Rover</h1>
        <div className="control-panel">
          <CameraView />
          {navigationView}
        </div>
        {batteryView}
        <div className="slider-wrapper">
          <input type="range" min="0" max="100" value={this.state.cameraAngle} onChange={this.onAngleChange.bind(this)} step="1" />
        </div>
        <div className="speed-wrapper">
          <input type="range" min="0" max="100" value={this.state.speed} onChange={this.onSpeedChange.bind(this)} />
          {this.state.speed}
          </div>
        <div>P: <input type="text" value={this.state.p} onChange={this.onPChange.bind(this)} /></div>
        <div>I: <input type="text" value={this.state.i} onChange={this.onIChange.bind(this)} /></div>
        <div>D: <input type="text" value={this.state.d} onChange={this.onDChange.bind(this)} /></div>
        <div>Ticks to go: <input type="text" value={this.state.ticksToGo} onChange={this.onTicksToGoChange.bind(this)} /></div>
        <button onClick={this.onGo.bind(this, 'forward')}>FW</button>
        <button onClick={this.onGo.bind(this, 'backward')}>BW</button>
        <button onClick={this.onGo.bind(this, 'left')}>LEFT</button>
        <button onClick={this.onGo.bind(this, 'right')}>RIGHT</button>
        <div>Left: {this.state.leftTicks}</div>
        <div>Right: {this.state.rightTicks}</div>
        <div>Diff: {this.state.rightTicks - this.state.leftTicks}</div>
        <div>Room temperature: {this.state.temp ? this.state.temp!.room : null}</div>
        <button onClick={this.onOff.bind(this)}>OFF</button>
        {statsView}
      </div>
    );
  }
}

/* 
        <Rover
          rear={!this.state.ir ? false : this.state.ir.rear}
          left={!this.state.ir ? false : this.state.ir.left}
          front={!this.state.ir ? false : this.state.ir.front}
          right={!this.state.ir ? false : this.state.ir.right}
        />
*/

//         <MotorStats {...this.state.motorStats} />
export default App;
