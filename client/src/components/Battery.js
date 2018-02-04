import React from 'react';

const Battery = ({battery}) =>
    <div>
        <div>{battery.voltage}V</div>
        <div>{battery.current_mA}mA</div>
    </div>

export default Battery
