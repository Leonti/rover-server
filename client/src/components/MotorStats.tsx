import React, { FunctionComponent, memo } from 'react'

export type Stat = {
    speedBase: number,
    speedSlave: number,
    ticksBase: number,
    ticksSlave: number,
    error: number,
    pTerm: number,
    iTerm: number,
    dTerm: number
}

export type Stats = {
    p: number,
    i: number,
    d: number,
    stats: [Stat]
}

type Props = {
    stats: Stats
}

const MotorStats: FunctionComponent<Props> = ({ stats }) =>
    <div className="motor-stats">
        Motor stats {stats.p} {stats.i} {stats.d} {stats.stats.length} {JSON.stringify(stats.stats[0])}
    </div>

const meomoized = memo(MotorStats)

export { meomoized as MotorStats }   