import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root"));

function Root() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    serviceWorkerRegistration.register({
      onUpdate: (registration) => {
        setIsUpdateAvailable(true);
      }
    });
  }, []);

  const handleUpdate = () => {
    window.location.reload(); // Reload the page to get the new version
  };

  const handleClose = () => {
    setIsUpdateAvailable(false); // Close the modal without doing anything
  };

  return (
    <div>
      <GoogleOAuthProvider clientId="576308191201-6rfma8s3e7hhbnevvnnn7gdijhujbltc.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
      <Dialog open={isUpdateAvailable} onClose={handleClose}>
        <DialogTitle>Update Available</DialogTitle>
        <DialogContent>
          <p>
            A new version is available. Please reload to get the latest version.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate} color="primary" variant="contained">
            Reload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

root.render(<Root />);

// Measure performance (optional)
reportWebVitals();
