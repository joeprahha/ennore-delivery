// src/components/Signup.js
import React, { useState } from 'react';
import { TextField, Button, Container, Snackbar } from '@mui/material';
import RoleModal from './RoleModal';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    const handleLongPress = () => {
        setModalOpen(true);
    };

    const handleRoleSelection = (selectedRole) => {
        setRole(selectedRole);
        setModalOpen(false);
    };

    const handleSignup = async () => {
        if (!email || !password || !role) {
            setSnackbarMessage('Please fill in all fields and select a role.');
            setSnackbarOpen(true);
            return;
        }

        // Prepare the payload to send to the API
        const payload = {
            email,
            password,
            scope: role, // Add the role as scope
        };

        try {
            const response = await fetch('/api/signup', {
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
                setSnackbarMessage('Signup failed. Please try again.');
            }
        } catch (error) {
            setSnackbarMessage('An error occurred. Please try again.');
        }
        setSnackbarOpen(true);
    };

    return (
        <Container maxWidth="xs">
            <h2 onMouseDown={handleLongPress}
                onMouseUp={() => setModalOpen(false)}>Signup as {role}</h2>
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
                onClick={handleSignup}
                style={{ marginTop: '16px' }}
            >
                Submit
            </Button>
            <RoleModal open={modalOpen} onClose={() => setModalOpen(false)} onRoleSelection={handleRoleSelection} />

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

export default Signup;
