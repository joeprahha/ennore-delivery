import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";

import "@fontsource/poppins"; // Importing a Google Font
import "@fontsource/pacifico"; // Optional decorative font

const DynamicTextAnimation = () => {
  const messages = ["Just Order it!!","Will Deliver You","Skip the queue", "Save the time", ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Trigger fade-out effect
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        setFade(true); // Trigger fade-in effect
      }, 500); // Duration for fade-out animation
    }, 1300); // Time between message transitions
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
     <Box sx={{ textAlign: "center", mt: 1 }}>
      <Typography
        sx={{
          fontSize: "1.5rem", // Increased size for emphasis
          fontWeight: "bold",
          fontFamily: "'Poppins', sans-serif", // Modern and sleek font
          background: "linear-gradient(90deg, #ff8a00, #e52e71)", // Gradient text
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          transition: "opacity 0.5s ease-in-out",
          opacity: fade ? 1 : 0, // Smooth fade-in/out
        }}
      >
        {messages[currentMessageIndex]}
      </Typography>
    </Box>
  );
};

const SplashScreen = ({ onComplete, showDuration = 20000 ,splashLoading}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true); // Handle splash screen visibility
  const theme = useTheme();


 
  return (
   <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: (theme) => theme.palette.primary.main,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999999,
        flexDirection: 'column',
      }}
    >
    <Box sx={{ display: "flex", flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
  {/* Dynamic text with fade-in/out effect (70% space) */}
  <Typography 
    sx={{
      fontSize: '2.25rem',
      fontWeight: 'bold',
      color: 'white',
      letterSpacing: '1.5px',
      textAlign: 'center',

    }}
  >
    <span
      style={{
        display: 'inline-block',
        opacity: 1,
        //animation: 'fadeInOut .5s ease-in-out infinite',
      }}
    >
      Ennore
    </span>
  </Typography>

  {/* Delivery box in the top-right corner (20% space) */}
  <Box
    sx={{
 height:'auto',	
 pl:1,pr:1,
      backgroundColor: 'white',
      color: 'primary.main', // Use the color code for your primary color
      fontWeight: 'bold',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
	
    }}
  >
    <Typography sx={{ fontSize: '2.25rem',      fontWeight: 'bold', }}>
      Delivery
    </Typography>
  </Box>
</Box>
<DynamicTextAnimation/>

    
      {/* Powered by text at the bottom */}
      <Box sx={{ position: 'absolute', bottom: '20px', textAlign: 'center', width: '100%' }}>
        <Typography sx={{ color: 'white', fontSize: '0.65rem' }}>
          Powered by Ennore Delivery
        </Typography>
      </Box>

      {/* Custom CSS for animations */}
      <style>
        {`
          @keyframes fadeInOut {
            0% {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default SplashScreen;

