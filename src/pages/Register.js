import React, { useState } from 'react';
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
  Link as MuiLink
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'startup', // Default to startup
    
    // Step 2: Profile Info (Startup)
    startupName: '',
    startupDescription: '',
    industry: '',
    fundingStage: '',
    
    // Step 2: Profile Info (Investor)
    investorName: '',
    investorDescription: '',
    investmentFocus: '',
    minimumInvestment: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNext = () => {
    // Validate first step
    if (activeStep === 0) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      setError('');
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate second step
    if (formData.userType === 'startup') {
      if (!formData.startupName || !formData.industry) {
        setError('Please fill in all required fields');
        return;
      }
    } else {
      if (!formData.investorName || !formData.investmentFocus) {
        setError('Please fill in all required fields');
        return;
      }
    }
    
    // Submit registration form - will be replaced with actual API call
    console.log('Registration form submitted:', formData);
    
    // Redirect to dashboard
    navigate(`/${formData.userType}/dashboard`);
  };

  const steps = ['Account Information', 'Profile Information'];

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 8
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Create Your Account
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Card sx={{ width: '100%' }}>
          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" noValidate>
              {activeStep === 0 ? (
                // Step 1: Account Information
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  
                  <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">I am a:</FormLabel>
                    <RadioGroup
                      row
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="startup" control={<Radio />} label="Startup" />
                      <FormControlLabel value="investor" control={<Radio />} label="Investor" />
                    </RadioGroup>
                  </FormControl>
                </>
              ) : (
                // Step 2: Profile Information
                formData.userType === 'startup' ? (
                  // Startup profile fields
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="startupName"
                      label="Startup Name"
                      value={formData.startupName}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      name="startupDescription"
                      label="Description"
                      multiline
                      rows={4}
                      value={formData.startupDescription}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="industry"
                      label="Industry"
                      value={formData.industry}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      name="fundingStage"
                      label="Funding Stage"
                      value={formData.fundingStage}
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  // Investor profile fields
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="investorName"
                      label="Name/Company Name"
                      value={formData.investorName}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      name="investorDescription"
                      label="Description"
                      multiline
                      rows={4}
                      value={formData.investorDescription}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="investmentFocus"
                      label="Investment Focus"
                      value={formData.investmentFocus}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      name="minimumInvestment"
                      label="Minimum Investment ($)"
                      type="number"
                      value={formData.minimumInvestment}
                      onChange={handleChange}
                    />
                  </>
                )
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                {activeStep === 0 ? (
                  <Box />
                ) : (
                  <Button onClick={handleBack}>Back</Button>
                )}
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    Create Account
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <MuiLink component={Link} to="/login" variant="body2">
                  Already have an account? Sign in
                </MuiLink>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register;