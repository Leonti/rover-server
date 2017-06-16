import React from 'react'

const CameraView = () =>
    <img src={`${window.location.protocol}//${window.location.hostname}:8080/stream/video.mjpeg`} />

export default CameraView
