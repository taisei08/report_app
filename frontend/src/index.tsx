import React from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App"
import Modal from 'react-modal';
import { Box } from "@material-ui/core";


Modal.setAppElement('#root');

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <Box style={{ wordBreak: 'break-all' }}>
      <App />
      </Box>
    </React.StrictMode>
)}