import React, { FunctionComponent, memo } from 'react'
import './CameraView.css'

const CameraView: FunctionComponent = () =>
    <div className="camera-view">
        <img
            alt={'Rover camera view'}
            src={`${window.location.protocol}//${window.location.hostname}:8080/stream/video.mjpeg`} />
    </div>

export default memo(CameraView)
