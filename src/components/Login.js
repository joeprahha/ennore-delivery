// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Container, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setSnackbarMessage('Please fill in all fields.');
            setSnackbarOpen(true);
            return;
        }

        // Prepare the payload to send to the API
        const payload = { email, password };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const { token } = await response.json(); // Expect token in response
                localStorage.setItem('jwt', token); // Store the JWT

                // Decode the JWT to get the scope
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
                const userScope = decodedToken.scope;

                // Redirect based on user role
                if (userScope === 'user') {
                    navigate('/user');
                } else if (userScope === 'storeOwner') {
                    navigate('/store');
                } else if (userScope === 'deliveryPartner') {
                    navigate('/delivery');
                }
            } else {
                setSnackbarMessage('Login failed. Please check your credentials.');
            }
        } catch (error) {
            setSnackbarMessage('An error occurred. Please try again.');
        }
        setSnackbarOpen(true);
    };

    return (
        <Container maxWidth="xs">
            <h2>Login</h2>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                style={{ marginTop: '16px' }}
            >
                Login
            </Button>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <MuiAlert elevation={6} severity="info" onClose={() => setSnackbarOpen(false)}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};

export default Login;
