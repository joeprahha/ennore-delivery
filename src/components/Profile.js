import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Avatar,
    Autocomplete,
    Snackbar,
    Alert,IconButton
} from '@mui/material';
import { api } from '../utils/api';
import { getUserInfo,setUserInfo } from '../utils/localStorage';
import { isTokenValid } from '../utils/auth';
import { logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
const locations = [
    'Nettukuppam',
    'Ennore Kuppam',
    'Thazhankuppam',
    'Mugathuvara Kuppam',
    'Ulagnathapuram',
    'SVM Nagar',
    'Vallur Nagar',
    'Kamaraj Nagar',
    'High School Surroundings',
    'Kaathukuppam',
    'RS Road',
    'Ennore Bus Depot Surroundings',
];

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState(getUserInfo() || { address1: '', area: '', phone: '' });
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    const handleEdit = () => {
        setIsEditing(true);
        setErrors({});
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSave = async () => {
        if (!validateFields()) return;

        await handleUpdateUserDetails();
        setIsEditing(false);
        setSnackbarMessage('Profile successfully updated!');
        setSnackbarOpen(true);
    };

    const validateFields = () => {
        const { name, phone, address1, local } = userInfo;
        const newErrors = {};

        if (!name) newErrors.name = "Name is required.";
        if (!phone) newErrors.phone = "Phone number is required.";
        if (phone && !/^\d{10}$/.test(phone)) newErrors.phone = "Phone number must be 10 digits.";
        if (!address1) newErrors.address1 = "Address Line is required.";
        if (!local) newErrors.local = "Local Area is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: undefined,
            }));
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!isTokenValid()) {
            logout(navigate);
        }
        const fetchUserData = async () => {
            if (!token) return;

            try {
                const response = await api.get('users');
                setUserInfo(response.data);
                localStorage.setItem('userInfo', JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching user data:', error.response ? error.response.data : error.message);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleUpdateUserDetails = async () => {
        try {
            await api.put('update-user', userInfo);
            localStorage.setItem('userInfo', JSON.stringify({ ...getUserInfo(), ...userInfo }));
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    return (
    <>
     <IconButton onClick={()=>navigate(-1)} sx={{pl:2}}>
                                    <ArrowBackIosNewOutlinedIcon />
                                </IconButton>
        <Box sx={{ padding: 3, textAlign: 'center' }}>
        
            {/* Profile Avatar */}
            <Avatar
                alt={userInfo.name || 'User Avatar'}
                src={userInfo.avatarUrl} // Assuming you have an avatar URL in userInfo
                sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }}
            />

            <Box sx={{ mt: 2 }}>
                <TextField
                    name="name"
                    label="Name"
                    value={userInfo.name}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mt: 1, mb: 2 }}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                        readOnly: !isEditing,
                    }}
                />
                <TextField
                    name="phone"
                    label="Phone Number"
                    value={userInfo.phone}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mt: 1, mb: 2 }}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                        readOnly: !isEditing,
                    }}
                />
                <TextField
                    name="address1"
                    label="Address Line"
                    value={userInfo.address1}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mt: 1, mb: 2 }}
                    error={!!errors.address1}
                    helperText={errors.address1}
                    InputProps={{
                        readOnly: !isEditing,
                    }}
                />
                <Autocomplete
                    fullWidth
                    sx={{ mt: 1, mb: 2 }}
                    options={locations}
                    value={userInfo.local}
                    onChange={(event, newValue) => {
                        handleChange({ target: { name: 'local', value: newValue } });
                    }}
                    inputValue={userInfo.local}
                    onInputChange={(event, newInputValue) => {
                        handleChange({ target: { name: 'local', value: newInputValue } });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name="local"
                            label="Local Area"
                            error={!!errors.local}
                            helperText={errors.local}
                            InputProps={{
                                ...params.InputProps,
                                readOnly: !isEditing,
                            }}
                        />
                    )}
                />
                <Box sx={{ mt: 3 }}>
                    {isEditing ? (
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save
                        </Button>
                    ) : (
                        <Button variant="outlined" color="primary" onClick={handleEdit}>
                            Edit
                        </Button>
                    )}
                </Box>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
        </>
    );
};

export default ProfilePage;

