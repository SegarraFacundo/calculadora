import { useEffect } from "react";

function Calculadora({titulo = "Bienvenido", calculo = "", resultado = "" }) {
  useEffect(() => {

  }, [titulo, calculo, resultado])
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="h-auto bg-white rounded-2xl shadow-xl border-2 border-gray-500">
          <div className="w-80 h-40 m-3 text-right space-y-6 py-2">
            <div className="text-2xl text-gray-900">{titulo}</div>
            <div className="text-gray-700">{calculo}</div>
            <div className="text-black font-bold text-3xl">{resultado}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculadora;
