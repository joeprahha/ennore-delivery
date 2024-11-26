import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Box, Typography, Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const QRCodeManager = () => {
  const [showAddForm, setShowAddForm] = useState(true);
  const [newQrCode, setNewQrCode] = useState({ redirectUrl: 'https://ennore-delivery-api.onrender.com/ennore-delivery/scanner', qrImage: null });
  const [loading, setLoading] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState('');

  // Use ref to access the canvas element after it renders
  const qrCodeCanvasRef = useRef(null);

  const handleChange = (e) => {
    setNewQrCode({
      ...newQrCode,
      [e.target.name]: e.target.value,
    });
  };

  // Use useEffect to handle QR code generation whenever the redirect URL changes
  useEffect(() => {
    if (newQrCode.redirectUrl) {
      setLoading(true);
      
      // Ensure QR code is rendered before trying to access the canvas
      const qrCodeCanvas = qrCodeCanvasRef.current;

      // Wait for the QR code canvas to be ready
      if (qrCodeCanvas) {
        // Generate the data URL of the canvas QR code
        const qrImage = qrCodeCanvas.toDataURL();
        setQrImageUrl(qrImage);
        setNewQrCode({ ...newQrCode, qrImage });
      }

      setLoading(false);
    }
  }, [newQrCode.redirectUrl]); // Re-run when redirectUrl changes

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = qrImageUrl;
    a.download = 'qr-code.png';
    a.click();
  };

  return (
    <Box sx={{ padding: 2 }}>
  

      {showAddForm && (
        <Box sx={{ }}>
        
          <TextField
            fullWidth
            label="Redirect Link"
            name="redirectUrl"
            value={newQrCode.redirectUrl}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          
          <Button
            variant="contained"
            color="primary"
            onClick={() => setNewQrCode({ ...newQrCode, redirectUrl: newQrCode.redirectUrl })}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate QR Code'}
          </Button>

          {newQrCode.redirectUrl&&( <Box sx={{ marginTop: 2 }}>
             (
              <div style={{ display: 'inline-block', margin: '20px' }}>
                <QRCodeCanvas
                  ref={qrCodeCanvasRef} // Use ref to capture the canvas element
                  value={newQrCode.redirectUrl}
                  size={200}
                />
              </div>
           

            {qrImageUrl && (
              <div>
                <Typography variant="body1">QR Code generated successfully!</Typography>
                <Button variant="contained" color="primary" onClick={handleDownload}>
                  Download QR Code
                </Button>
              </div>
            )}
          </Box> )}
        </Box>
      )}
    </Box>
  );
};

export default QRCodeManager;

