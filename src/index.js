import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
  // react-snap pre-rendered this page — hydrate instead of fresh render
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

serviceWorkerRegistration.register();
reportWebVitals();
