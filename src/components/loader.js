import React from "react";
import "../asset/css/loader.css";

function Loader() {
  return (
    <div style={{textAlign: "-webkit-center"}}>
      <div
        className="loader border-t-2 rounded-full border-yellow-500 bg-yellow-300 animate-spin
aspect-square w-8 flex justify-center items-center text-yellow-700"
      >
        $
      </div>
    </div>
  );
}

export default Loader;
