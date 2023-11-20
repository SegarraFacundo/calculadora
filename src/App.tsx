import { createRef } from "react";
import "./App.css";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Recording from "./script";
import { ObjectDetection } from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

function App() {
  const record = new Recording();
  const videoRef = createRef<HTMLVideoElement>();
  let detectoPersona: boolean = false

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const webCamPromise = navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
        },
      })
      .then((stream) => {
        window.stream = stream;

        return new Promise<void>((resolve, reject) => {
          if (videoRef && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {              
              resolve();
            };
          } else reject("no se renderizo el video");
        });
      });
    const modelPromise = cocoSsd.load();
    Promise.all([modelPromise, webCamPromise])
      .then((values) => {
        if (videoRef.current) {
          detectFrame(videoRef.current, values[0]);
        }
      })
      .catch((err) => {
        console.error(err)
      });
  }

  function detectFrame(video: HTMLVideoElement, model: ObjectDetection): void {
    model.detect(video).then((predictions) => {
      
      if (predictions && predictions.length > 0 && !detectoPersona) {
        const a = predictions.find((v) => v.class === "person");
        console.log(a);
        detectoPersona = true
        record.record();
      }
      // this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        detectFrame(video, model);
      });
    });
  };

  return (
    <>
      <div>
        <video
          className="size"
          autoPlay
          playsInline
          muted
          ref={videoRef}
          width="0"
          height="0"
        />
        <button className="record">Grabar</button>
        <button className="clear">Borrar</button>
        <div className="display">
          <span className="result">Resultado</span>
        </div>
      </div>
    </>
  );
}

export default App;
