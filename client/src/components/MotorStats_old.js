import React from 'react'
import './MotorStats.css'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'

const getLeftTicks = e => e.left.ticks
const getRightTicks = e => e.right.ticks
const getLeftSpeed = e => e.left.speed
const getRightSpeed = e => e.right.speed
const getErrorLeft = e => e.left.error
const getErrorRight = e => e.right.error
const getTargetValue = target => () => target

function pure(func) {
  class PureComponentWrap extends React.PureComponent {
    render() {
      return func(this.props, this.context)
    }
  }
  return PureComponentWrap
}

const adjustTime = entries => {
  console.log('rendering')
  if (entries) {
    const startTime = entries[0].time
    return entries.map(e => {
      e.time = e.time - startTime
      return e
    })
  } else {
    return entries
  }
}

const formatPid = pid => pid ? `Kp: ${pid.p} Ki: ${pid.i} Kd: ${pid.d}` : ''

const MotorStats = pure(({ pid, target, entries }) =>
    <div className="motor-stats">
      <div className="settings">{formatPid(pid)}</div>
      <LineChart width={900} height={500} data={adjustTime(entries)}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="time" type="number" />
       <YAxis />
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey={getRightTicks} name="right measured" stroke="#8884d8" dot={false} />
       <Line type="monotone" dataKey={getRightSpeed} name="right speed %" stroke="#b642f4" dot={false} />
       <Line type="monotone" dataKey={getLeftTicks} name="left measured" stroke="#4c4a7a" dot={false} />
       <Line type="monotone" dataKey={getLeftSpeed} name="left speed %" stroke="#4a1a63" dot={false} />
       <Line type="monotone" dataKey={getErrorLeft} name="left error" stroke="#eef442" dot={false} />
       <Line type="monotone" dataKey={getErrorRight} name="right error" stroke="#7c7f22" dot={false} />       
       <Line type="monotone" dataKey={getTargetValue(target)} name="target" stroke="#82ca9d" dot={false} />
      </LineChart>
    </div>
)

export default MotorStats
