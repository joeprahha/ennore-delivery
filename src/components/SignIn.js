import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
    Modal,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setToken, redirectUser, getToken } from '../utils/auth';
import { baseUrl } from '../utils/api';


const SignIn = () => {
    const [email, setEmail] = useState('');
    const [openTerms, setOpenTerms] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [timer, setTimer] = useState(180);
    const navigate = useNavigate();

    // Check for existing token on component mount
    useEffect(() => {
        const token = getToken();
        if (token) {
            redirectUser(navigate);
        }
    }, [navigate]);

    // Timer effect
    useEffect(() => {
        let countdown;
        if (showOtpInput && !isResendEnabled) {
            countdown = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        setIsResendEnabled(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(countdown);
    }, [showOtpInput, isResendEnabled]);

    const handleSendOtp = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSnackbarMessage('Enter a valid email address');
            setSnackbarOpen(true);
            return;
        } setShowOtpInput(true);

        try {
            await axios.post(`${baseUrl}/send-otp`, { email });

            setSnackbarMessage('OTP sent to your email');
            setIsResendEnabled(false);
            setTimer(180); // Reset timer to 3 minutes
        } catch (error) {
            setSnackbarMessage('Error sending OTP');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post(`${baseUrl}/verify-otp`, { email, otp });
            const { token } = response.data;
            setToken(token);
            redirectUser(navigate);
        } catch (error) {
            setSnackbarMessage('Invalid OTP');
            setSnackbarOpen(true);
        }
    };

    return (
        <Box sx={{ p: 2, position: 'relative' }}>
            <Typography variant="h4" gutterBottom>
                Sign In
            </Typography>
            <TextField
                fullWidth
                label="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
            />
            <br />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isTermsAccepted}
                        onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                    />
                }
                label={
                    <span>
                        I agree to the{' '}
                        <span
                            onClick={() => setOpenTerms(true)}
                            style={{ color: 'green', cursor: 'pointer' }}
                        >
                            Terms and Conditions
                        </span>
                    </span>
                }
            />
            {/* Send OTP or Resend OTP button */}
            <Box mt={2}>
                <Button
                    variant="contained"
                    onClick={handleSendOtp}
                    disabled={!isTermsAccepted || (showOtpInput && !isResendEnabled)}
                >
                    {showOtpInput && isResendEnabled
                        ? `Resend OTP`
                        : `Send OTP`}
                </Button>
                {showOtpInput && !isResendEnabled && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Resend OTP in {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)} seconds
                    </Typography>
                )}
            </Box>

            {showOtpInput && (
                <Box mt={2}>
                    <TextField
                        fullWidth
                        label="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        margin="normal"
                        sx={{ width: '50%' }}
                    />
                    <br /><br />
                    <Button variant="contained" onClick={handleVerifyOtp}>
                        Sign In
                    </Button>
                </Box>
            )}

            <Modal open={openTerms} onClose={() => setOpenTerms(false)}>
                <Box sx={{ p: 4, bgcolor: 'white', margin: 'auto', width: '400px', mt: '10%' }}>
                    <Typography variant="h6">Terms and Conditions</Typography>
                    <Typography>Here are the terms and conditions...</Typography>
                    <Button onClick={() => setOpenTerms(false)}>Close</Button>
                </Box>
            </Modal>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Box>
    );
};

export default SignIn;

