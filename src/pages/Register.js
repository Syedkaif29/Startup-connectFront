import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, 
    Button, 
    Container,
    TextField,
    Typography,
    Card, 
    CardContent,
    FormControl,
    FormControlLabel,
    FormLabel,
    RadioGroup,
    Radio,
    Stepper,
    Step,
    StepLabel,
    Alert,
    Link as MuiLink,
    Grid,
    Paper,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        // Step 1: Account Information
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: '',
        
        // Step 2: Profile Information
        // Startup Profile
        startupName: '',
        startupDescription: '',
        industry: '',
        fundingStage: '',
        
        // Investor Profile
        investorName: '',
        investorDescription: '',
        investmentFocus: '',
        minimumInvestment: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleNext = () => {
        // Validate step 1
        if (activeStep === 0) {
            if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName || !formData.role) {
                setError('Please fill in all required fields');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }
        setError('');
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate step 2
            if (formData.role === 'STARTUP') {
                if (!formData.startupName || !formData.industry || !formData.fundingStage) {
                    setError('Please fill in all required startup fields');
                    return;
                }
            } else if (formData.role === 'INVESTOR') {
                if (!formData.investorName || !formData.investmentFocus || !formData.minimumInvestment) {
                    setError('Please fill in all required investor fields');
                    return;
                }
            }

            const response = await authService.register(formData);
            
            // Redirect based on user role
            if (response.user.role === 'ADMIN') {
                navigate('/admin-dashboard');
            } else if (response.user.role === 'STARTUP') {
                navigate('/startup-dashboard');
            } else if (response.user.role === 'INVESTOR') {
                navigate('/investor-dashboard');
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    label="Role"
                                >
                                    <MenuItem value="STARTUP">Startup</MenuItem>
                                    <MenuItem value="INVESTOR">Investor</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                );
            case 1:
                return formData.role === 'STARTUP' ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Startup Name"
                                name="startupName"
                                value={formData.startupName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="startupDescription"
                                multiline
                                rows={4}
                                value={formData.startupDescription}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Industry"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Funding Stage</InputLabel>
                                <Select
                                    name="fundingStage"
                                    value={formData.fundingStage}
                                    onChange={handleChange}
                                    label="Funding Stage"
                                >
                                    <MenuItem value="Seed">Seed</MenuItem>
                                    <MenuItem value="Early">Early Stage</MenuItem>
                                    <MenuItem value="Growth">Growth Stage</MenuItem>
                                    <MenuItem value="Late">Late Stage</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Investor Name"
                                name="investorName"
                                value={formData.investorName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="investorDescription"
                                multiline
                                rows={4}
                                value={formData.investorDescription}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Investment Focus"
                                name="investmentFocus"
                                value={formData.investmentFocus}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Minimum Investment"
                                name="minimumInvestment"
                                type="number"
                                value={formData.minimumInvestment}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Register
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                        <Step>
                            <StepLabel>Account Information</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Profile Information</StepLabel>
                        </Step>
                    </Stepper>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        {getStepContent(activeStep)}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} sx={{ mr: 1 }}>
                                    Back
                                </Button>
                            )}
                            {activeStep === 0 ? (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={loading}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    Create Account
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;