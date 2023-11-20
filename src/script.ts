// Checking API availability


export default class Recording {

  recognition: SpeechRecognition;
  transcript: string;
  statement: HTMLHeadingElement;
  result: HTMLHeadingElement;
  display: any;
  constructor() {
    // API variables
    const SpeechRecognition: any =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = "es-AR";
    this.recognition.continuous = true;
    this.transcript = "";
    //this.recognition.interimResults = true;

    this.statement = document.createElement("h5");
    this.result = document.createElement("h4");
    this.display = document.querySelector(".display");

    this.addEventListeners();
  }

  addEventListeners() {
    // Calculating and showing the result
    this.recognition.addEventListener("result", (e: SpeechRecognitionEvent) => {
      this.speechProcess(e);
    });

    this.recognition.addEventListener("nomatch", (e: SpeechRecognitionEvent) => {
      this.display.textContent = e.results.item.toString();
    });
  }

  // Methods for record and clear
  record() {
    try {
      this.recognition.start();
    } catch { 
    }
  }

  clear() {
    //this.recognition.stop();
    this.transcript = "";
    this.statement.textContent = "";
    this.result.textContent = "";
    this.recognition.stop();
    this.record();
  }

  stop() {
    this.clear();
    this.recognition.stop();
  }

  speechProcess(e: SpeechRecognitionEvent) {
    this.transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");
    console.log("this.transcript", this.transcript);
    if (this.transcript.includes("limpiar")) this.clear();
    if (this.transcript.includes("parar")) this.stop();
    // Checking multiplications (* asterisk) and divisions (/ slash) for similar words
    if (this.transcript.includes("multiply")) {
      this.transcript = this.transcript.replace("multiply", "*");
    } else if (this.transcript.includes("x")) {
      this.transcript = this.transcript.replace("x", "*");
    } else if (this.transcript.includes("X")) {
      this.transcript = this.transcript.replace("X", "*");
    } else if (this.transcript.includes("multiplied")) {
      this.transcript = this.transcript.replace("multiplied", "*");
    }

    if (this.transcript.includes("divide")) {
      this.transcript = this.transcript.replace("divide", "/");
    } else if (this.transcript.includes("divided")) {
      this.transcript = this.transcript.replace("divided", "/");
    } else if (this.transcript.includes("/d")) {
      this.transcript = this.transcript.replace("/d", "/");
    }

    console.log(this.transcript);

    // Displaying
    this.statement.textContent = this.transcript;
    //this.display.appendChild(this.statement);

    this.result.textContent = eval(this.transcript);
    this.transcript = "";
    console.log("resultado", eval(this.transcript))
    //this.display.appendChild(this.result);
  }
}
