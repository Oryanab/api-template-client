import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CsrfProvider } from "./CsrfProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <CsrfProvider>
    <App />
  </CsrfProvider>
);
