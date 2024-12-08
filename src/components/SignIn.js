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
    Divider,
    Grid,
    Paper,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,IconButton,CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setToken, redirectUser, getToken,decodeToken } from '../utils/auth';
import { baseUrl, api } from '../utils/api';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { getCartFromLocalStorage ,isValidCustomerDetails} from '../utils/localStorage';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isTermsAccepted, setIsTermsAccepted] = useState(true);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [timer, setTimer] = useState(180);
    const [loginMethod, setLoginMethod] = useState('otp');
    const [isGoogle, setIsGoogle] = useState(false);
    const[googleLoader,setGoogleLoader]=useState(false)
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState([]);
    const [activeTab, setActiveTab] = useState(0); // 0 for Sign In, 1 for Sign Up
    const navigate = useNavigate();
      const [showPassword, setShowPassword] = useState(false); // Toggle visibility of password
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle visibility of confirm password

  const [clickCount, setClickCount] = useState(0);

    const [signLoader, setSignLoader] = useState(false); // 0 for Sign In, 1 for Sign Up


const handleClick = () => {
    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 8) {
        setLoginMethod('password'); // Trigger your action here
      }
      return newCount;
    });
  };
 useEffect(() => {
  async function fetchData() {
  await api.get('health');
  }
  fetchData();

                   
    }, []);

    useEffect(() => {
        const token = getToken();
        if (token) {
            redirectUser(navigate);
        }
    }, [navigate]);

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




    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error),

    });
 useEffect(() => {
        if (user) {
            	setGoogleLoader(true)
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json',
                    },
                })
                .then((res) => {
                    setProfile(res.data);

                    handleVerifyOtp(res.data.email, true);
                    setGoogleLoader(true)
                })
                .catch((err) => console.log(err));
        }
    }, [user]);
    
    const fetchUserInfo=async()=>{
          try{
const response = await axios.get(`${baseUrl}users`, {
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  }
})
localStorage.setItem('userInfo', JSON.stringify(response.data));


}
catch(err){}}

    const handleSendOtp = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSnackbarMessage('Enter a valid email address');
            setSnackbarOpen(true);
            return;
        }
        setShowOtpInput(true);

        try {
            await api.post('send-otp', { email });

            setSnackbarMessage('OTP sent to your email');
            setIsResendEnabled(false);
            setTimer(180); // Reset timer to 3 minutes
        } catch (error) {
            setSnackbarMessage('Error sending OTP');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleVerifyOtp = async (googleEmail, isGoogle = false) => {
        try {
                	setSignLoader(true)
            const userEmail = email || googleEmail;
            const response = await api.post('verify-otp', { email: userEmail, otp, isGoogle });
            const { token } = response.data;
            setToken(token);
            
            setIsGoogle(false);
            //TODo
    await fetchUserInfo()
        if( isValidCustomerDetails){
        return navigate("/profile");
}else{
return redirectUser(navigate);
}

        } catch (error) {
            setSnackbarMessage('Invalid OTP');
            setSnackbarOpen(true);
        }
         finally{
                	setSignLoader(false)
        }
    };

    const handlePasswordLogin = async () => {
        if (!email || !password) {
            setSnackbarMessage('Please enter email and password');
            setSnackbarOpen(true);
            return;
        }

        try {
        	setSignLoader(true)
            const response = await api.post('signin', { email, password });
            const { token } = response.data;
            setToken(token);
            await fetchUserInfo()
            redirectUser(navigate);
        } catch (error) {
            setSnackbarMessage('Invalid credentials');
            setSnackbarOpen(true);
        }
        finally{
                	setSignLoader(false)
        }
    };

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword) {
            setSnackbarMessage('Please fill in all fields');
            setSnackbarOpen(true);
            return;
        }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSnackbarMessage('Enter a valid email address');
            setSnackbarOpen(true);
            return;
        }
	if(password.length<5){
	            setSnackbarMessage('Passwords length minimum 5');
	                        setSnackbarOpen(true);
	            return
	}
        if (password !== confirmPassword) {
            setSnackbarMessage('Passwords do not match');
            setSnackbarOpen(true);
            return;
        }
        

        try {
                	setSignLoader(true)
            const response = await api.post('signup', { email, password });
            const { token } = response.data;
            setToken(token);
                        await fetchUserInfo()
            redirectUser(navigate);
        } catch (error) {
            setSnackbarMessage('Error during sign up');
            setSnackbarOpen(true);
        }
         finally{
                	setSignLoader(false)
        }
    };

    return (
    <>
    
    
    
        <Box sx={{ p: 3 }}>
         <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    color: 'primary.main', 
                    fontWeight: 'bold',
                    fontSize:'0.75rem' 
                }}
                onClick={handleClick}
            >
                Ennore Delivery!!
            </Typography>
            <Typography 
                variant="body2" 
                sx={{ 
                    fontSize: '0.7rem', 

                }}
            >
                Whatever you order in Ennore<br />
                We will delivery in Ennore
            </Typography>
        </Box>
        
            <Paper sx={{ pl: 3,pr:3,pd:3, display: 'flex', flexDirection: 'column', alignItems: 'center' }} elevation={0}>
             {/* <Tabs
                    value={activeTab}
                    onChange={(e, newTab) => setActiveTab(newTab)}
                    variant="fullWidth"
                    sx={{ width: '100%', mb: 3 }}
                >
                    <Tab label="Sign In" />
                    <Tab label="Sign Up" />
                </Tabs> */}
                
                <Button
    variant="outlined"
    sx={{
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50px',
        border: 'none',
    }}
    onClick={googleLogin}
    startIcon={<GoogleIcon sx={{ color: 'white' }} />}
>
    {googleLoader ? <CircularProgress size={24} color="white" /> : 'Sign In with Gmail'}
</Button>

                        <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                            <Divider sx={{ flex: 1 }} />
                            <Box sx={{ paddingX: 2, color: 'gray' }}>or</Box>
                            <Divider sx={{ flex: 1 }} />
                        </Box>
                {activeTab === 0 && (
                    <>
              

                <Grid container spacing={2}>
                    {/* Email Field */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                        />
                    </Grid>

                   
			{/* Terms Checkbox */}
             
                </Grid>
                    {/* OTP Field (if OTP is selected) */}
                   {loginMethod === 'otp' && (
    <>
        <Grid container spacing={2}>
            {/* Button for sending OTP */}
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    onClick={handleSendOtp}
                    disabled={ (showOtpInput && !isResendEnabled)}
                    fullWidth
                    sx={{ mt: 2 }}  
                >
                    {showOtpInput && isResendEnabled ? 'Resend OTP' : 'Send OTP'}
                </Button>
            </Grid>

           

            {/* OTP Input Field */}
            {showOtpInput && (
               <> <Grid item xs={12}>
    <TextField
        fullWidth
        label="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        margin="normal"
    />
</Grid>
 {/* Timer text for Resend OTP */}
            {showOtpInput && !isResendEnabled && (
                <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1,fontSize:'0.6rem' }}>
                        Resend OTP in {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)} seconds
                    </Typography>
                </Grid>
            )}

<Grid item xs={12}>
    <Button
        variant="contained"
        onClick={handleVerifyOtp}
        
        fullWidth

    >
        {signLoader ? <CircularProgress size={24} /> : 'Verify & Sign In'}
       
    </Button>
  
</Grid>
</>
            )}
        </Grid>
    </>
)}


{/* Password Field (if Password login is selected) */}
{loginMethod === 'password' && (
    <Box sx={{ width: '100%' }}>
        <Grid container spacing={2}> 
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Enter Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                />
            </Grid>
            <Grid item xs={12}>
                <Button
    variant="contained"
    onClick={handlePasswordLogin}
    fullWidth
    disabled={signLoader} // Optionally disable the button while loading
>
    {signLoader ? <CircularProgress size={24} /> : 'Sign In'}
</Button>
            </Grid>
        </Grid>
    </Box>
)}

 
<Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
   {/* <Grid item>
        <Button
            variant="text"
            color="primary"
            onClick={() => setLoginMethod(loginMethod === 'otp' ? 'password' : 'otp')}
            sx={{
                textTransform: 'none',
                padding: 0,
                minWidth: 'auto',
                boxShadow: 'none',
                border: 'none',
                color:'blue'
            }}
        >
            {loginMethod === 'otp' ? 'Sign in using Password' : 'Sign in using OTP'}
        </Button>
    </Grid> */}
</Grid>




                    
                    </>
                )}

                {activeTab === 1 && (
                    <>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                           <TextField
        fullWidth
        label="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button onClick={handleSendOtp} variant="contained" color="primary">
                Verify
              </Button>
            </InputAdornment>
          ),
        }}
      />                   </Grid>

                           <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Enter Password"
                    type={showPassword ? 'text' : 'password'} // Toggle between text and password types
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility state
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            {/* Confirm Password Field */}
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'} // Toggle between text and password types
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle confirm password visibility"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)} // Toggle visibility state
                                    edge="end"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
             {  <Grid item xs={12}>
                        <FormControlLabel
    control={
        <Checkbox
            checked={isTermsAccepted}
            onChange={() => setIsTermsAccepted(!isTermsAccepted)}
        />
    }
    label={
        <span style={{ fontSize: '0.85rem' }}>
            I agree to the{' '}
            <span
                onClick={() => navigate('/tc')}
                style={{ color: 'green', cursor: 'pointer' }}
            >
                Terms and Conditions
            </span>
        </span>
    }
/>

                    </Grid>}


                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    onClick={handleSignUp}
                                    fullWidth
                                    disabled={!isTermsAccepted}
                                >
                                    {signLoader ? <CircularProgress size={24} /> : 'Sign Up'}

                                    
                                </Button>
                                
                            </Grid>
                        </Grid>
                    </>
                )}
                
               
            </Paper>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
           
        </Box>
   <Box sx={{ textAlign: 'center', fontSize: '0.65rem', py: 1, bgcolor: 'white', mt: 2 }}>
        <span>© {new Date().getFullYear()} Ennore Delivery | </span>
        <span
            onClick={() => navigate('/tc')}
            style={{ color: 'blue', cursor: 'pointer' }}
        >
            Terms and Conditions
        </span>
        <span> | </span>
        <span
            onClick={() => navigate('/about')}
            style={{ color: 'blue', cursor: 'pointer' }}
        >
            About
        </span>
    </Box>
</>
    );
};

export default SignIn;

