import React, { StatelessComponent } from 'react'

type BatteryStats = {
    voltage: number,
    currentMa: number,
}

export type Props = {
    battery: BatteryStats,
    batteryTemp: number
}

const Battery: StatelessComponent<Props> = ({battery, batteryTemp}) =>
    <div>
        <div>{battery.voltage}V</div>
        <div>{battery.currentMa}mA</div>
        <div>{batteryTemp}C</div>
    </div>

export default Battery
