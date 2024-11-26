import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    Container,
    Paper,
} from '@mui/material';
import { api } from '../../../utils/api';

const AgreementForm = () => {
    const [formData, setFormData] = useState({
        companyAddress: 'Ennore Delivery',
        partnerName: 'testtest',
        partnerAddress: 'testtest',
        companyRepresentative: 'Ennore Delivery',
        partnerRepresentative: 'testtest',
        email: 'joeprabha27@gmail.com	',
        logoUrl: 'https://asset.cloudinary.com/dq6e1ggmv/4d40748be35f8451e617d1926df09712',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await api.post('create-agreement', formData);
            alert('Agreement generated and sent successfully!');
        } catch (error) {
            console.error('Error generating agreement:', error);
            alert('Failed to generate the agreement. Please try again.');
        }
    };

    return (
        <Box >
            <Paper elevation={0} sx={{ padding: 2}}>
             
                <Box component="form" noValidate autoComplete="off" sx={{ marginTop: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="companyAddress"
                                label="Company Address"
                                variant="outlined"
                                value={formData.companyAddress}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="partnerName"
                                label="Partner Name"
                                variant="outlined"
                                value={formData.partnerName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="partnerAddress"
                                label="Partner Address"
                                variant="outlined"
                                value={formData.partnerAddress}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="companyRepresentative"
                                label="Company Representative Name"
                                variant="outlined"
                                value={formData.companyRepresentative}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="partnerRepresentative"
                                label="Partner Representative Name"
                                variant="outlined"
                                value={formData.partnerRepresentative}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="email"
                                label="Partner Email"
                                variant="outlined"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="logoUrl"
                                label="Logo URL"
                                variant="outlined"
                                value={formData.logoUrl}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ marginTop: 3 }}
                        fullWidth
                    >
                        Create Agreement
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AgreementForm;

