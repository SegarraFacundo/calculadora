class Recording {
  recognition: SpeechRecognition;
  transcript: string;
  resultado: string = "";
  calculo: string = "";
  titulo: string = "";

  constructor() {
    // API variables
    const SpeechRecognition: any =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = "es-AR";
    this.recognition.continuous = true;
    this.transcript = "";
    this.recognition.interimResults = true;

    this.addEventListeners();    
  }



  addEventListeners() {
    // Calculating and showing the result
    this.recognition.addEventListener("result", (e: SpeechRecognitionEvent) => {
      this.speechProcess(e);
    });

    this.recognition.addEventListener(
      "nomatch",
      (e: SpeechRecognitionEvent) => {
        console.log(e);
      }
    );
    this.recognition.continuous = false
    this.recognition.interimResults = false
  }

  // Methods for record and clear
  record() {
    try {
      this.recognition.start();
      this.titulo = "Digame que calculo te resuelvo...";
    } catch {
      this.titulo = "Espera...";
    }
  }

  clear() {
    this.transcript = "";
    this.titulo = "";
  }

  stop() {
    this.clear();
    this.recognition.stop();
  }

  reiniciar() {
    this.stop();
    this.record();
  }

  speechProcess(e: SpeechRecognitionEvent) {
    if (this.transcript) {
      this.reiniciar();
      return
    }
    this.transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");

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



    try {
      console.log(this.transcript);
      const resultado = eval(this.transcript);
      this.calculo = this.transcript;
      this.resultado = resultado;
      console.log(resultado);
      
      
    } catch (e) {
      this.reiniciar();
    }
  }
}

export default Recording;
