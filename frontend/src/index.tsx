import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom"; // Make sure to import BrowserRouter
import App from "./App";
import { StoreProvider } from "./stores/StoreContext"; // Ensure this is correctly imported

ReactDOM.render(
  <BrowserRouter>
    <StoreProvider>
      <App />
    </StoreProvider>
  </BrowserRouter>,
  document.getElementById("root")
);