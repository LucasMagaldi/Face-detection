
import './App.css';
import React, {useRef} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemash from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import { drawMesh } from './utilities';

function App() {

  const WebcamRef = useRef(null);
  const CanvasRef = useRef(null);

  //Load Facemash
  const runFacemash = async ()=>{
    const net = await facemash.load({
      inputResolution: {width: 640, height: 480},
      scale: 0.8
    });

    setInterval(()=>{
      detect(net)
    }, 100)
  };

  // Run detection function
  const detect = async(net)=>{
    if(typeof WebcamRef.current !=='undefined' &&
     WebcamRef.current !==null && 
     WebcamRef.current.video.readyState  === 4
     ) {
       // Video Properties
       const video = WebcamRef.current.video;
       const videoWidth = WebcamRef.current.video.videoWidth;
       const videoHeight = WebcamRef.current.video.videoHeight;

       WebcamRef.current.video.width = videoWidth;
       WebcamRef.current.video.height = videoHeight;

       CanvasRef.current.width = videoHeight;
       CanvasRef.current.height = videoHeight;

       const face = await net.estimateFaces(video);
       console.log(face);

       const ctx = CanvasRef.current.getContext("2d");
       drawMesh (face,ctx)
     }
  }

  runFacemash();

  return (
    <div className="App">
      <header className='App-header'>
         <Webcam ref={WebcamRef} style={
          {
          position: 'absolute',
          marginLeft:  'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 9,
          width: 640,
          height: 480,
         }
         } />

         <canvas ref={CanvasRef} style={
          {
            position: 'absolute',
            marginLeft:  'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480,
          }
         }/>
      </header>
    </div>
  );
}

export default App;
