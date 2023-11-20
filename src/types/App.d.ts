export {};

declare global {
  interface Window {
    stream: MediaStream;
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}