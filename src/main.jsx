import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { MovieProvider } from "./context/MovieContext.jsx";

createRoot(document.getElementById("root")).render(
  <MovieProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MovieProvider>
);
