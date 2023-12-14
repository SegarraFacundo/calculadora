import { useEffect, useRef, useState } from "react";
import "./App.css";
import * as faceapi from "face-api.js";
import Calculadora from "./Calculadora";

const SpeechRecognition: any =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [titulo, setTitulo] = useState("Bienvenido");
  
  const [calculo, setCalculo] = useState("");
  const [resultado, setResultado] = useState("");
  const seDectectoNuevaPersona = useRef(false);

  const [transcript, setTranscript] = useState("");
  const [recognition] = useState(new SpeechRecognition());


  useEffect(() => {
    if (videoRef) {
      comenzarVideo();
    }
  }, [videoRef]);

  const comenzarVideo = () => {
    clear();
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((currentStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
          setTitulo("Acercate a la camara");
          detectorDeRostro();
        } else {
          setTitulo("Esperando la camara...");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const cargarModelosRostros = async () => {
    const MODELOS_URL = "/models";
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODELOS_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODELOS_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODELOS_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODELOS_URL),
    ]);
  };

  const detectorDeRostro = async () => {
    if (videoRef.current) {
      await cargarModelosRostros();
      const detectedFace = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());
      seDectectoNuevaPersona.current = detectedFace != undefined;
      if (seDectectoNuevaPersona.current) {
        recognition.lang = "es-AR";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.addEventListener("result", (e: SpeechRecognitionEvent) => {
          speechProcess(e);
        });
        recognition.continuous = false;
        recognition.interimResults = false;
        record();
      }

      if (!seDectectoNuevaPersona.current) {
        console.log("esta apagado");
        setTitulo("Hasta luego");
        stop();
      }
    }
    requestAnimationFrame(() => {
      if (!seDectectoNuevaPersona.current) detectorDeRostro();
    });
  };

  function record(): void {
    try {
      recognition.start();
      setTitulo("Abriendo el microfono")
      setTimeout(() =>  setTitulo("Digame el calculo te resuelvo"), 3000)
    } catch {
     
    }
  }

  function clear(): void {
    setTranscript("");
    setTitulo("");
    setResultado("");
    setCalculo("");
  }

  function stop() {
    //clear();
    recognition.stop();
  }

  function reiniciar() {
    stop();
    record();
  }

  useEffect(() => {
    if(resultado) {
      reiniciar()
    }
  }, [resultado])

  function speechProcess(e: SpeechRecognitionEvent) {
    if (transcript) {
      setTranscript("")
      reiniciar();
      return;
    }
    const newTranscript = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");
    setTranscript(
      newTranscript
    );

    if (newTranscript.includes("limpiar")) 
      reiniciar()

    if (newTranscript.includes("multiply")) {
      setTranscript(newTranscript.replace("multiply", "*"));
    } else if (newTranscript.includes("x")) {
      setTranscript(newTranscript.replace("x", "*"));
    } else if (newTranscript.includes("X")) {
      setTranscript(newTranscript.replace("X", "*"));
    } else if (newTranscript.includes("multiplied")) {
      setTranscript(newTranscript.replace("multiplied", "*"));
    }

    if (newTranscript.includes("divide")) {
      setTranscript(newTranscript.replace("divide", "/"));
    } else if (newTranscript.includes("divided")) {
      setTranscript(newTranscript.replace("divided", "/"));
    } else if (newTranscript.includes("/d")) {
      setTranscript(newTranscript.replace("/d", "/"));
    }

    try {
      const res = eval(newTranscript);
      setCalculo(newTranscript);
      setResultado(res);
      
    } catch (e) {
      console.error(e)
      setCalculo("No se pudo resolver")
    }
    setTimeout(() => {
      comenzarVideo();
    } , 5000)
  }

  return (
    <>
      <video
        autoPlay
        playsInline
        muted
        ref={videoRef}
        width="0"
        height="0"
        crossOrigin="anonymous"
      />

      <Calculadora titulo={titulo} calculo={calculo} resultado={resultado} />
    </>
  );
}

export default App;
