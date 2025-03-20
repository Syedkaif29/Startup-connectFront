import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Container,
  useMediaQuery,
  useTheme,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// Note: You'll need to create this auth logic later
// import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // This will be connected to your Redux store later
  const isAuthenticated = false; // useSelector(state => state.auth.isAuthenticated);
  const userRole = 'guest'; // useSelector(state => state.auth.user?.role);
  
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // dispatch(logout());
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    if (userRole === 'startup') {
      navigate('/startup/profile');
    } else if (userRole === 'investor') {
      navigate('/investor/profile');
    } else if (userRole === 'admin') {
      navigate('/admin/dashboard');
    }
    handleClose();
  };

  return (
    <AppBar position="static" color="primary">
      <Container>
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Startup Connect
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/" onClick={handleClose}>Home</MenuItem>
                {!isAuthenticated ? (
                  <>
                    <MenuItem component={Link} to="/login" onClick={handleClose}>Login</MenuItem>
                    <MenuItem component={Link} to="/register" onClick={handleClose}>Register</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              
              {!isAuthenticated ? (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    component={Link} 
                    to="/register"
                    sx={{ ml: 1 }}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  {userRole === 'startup' && (
                    <Button color="inherit" component={Link} to="/startup/dashboard">
                      Dashboard
                    </Button>
                  )}
                  {userRole === 'investor' && (
                    <Button color="inherit" component={Link} to="/investor/dashboard">
                      Dashboard
                    </Button>
                  )}
                  {userRole === 'admin' && (
                    <Button color="inherit" component={Link} to="/admin/dashboard">
                      Admin Panel
                    </Button>
                  )}
                  <Box sx={{ ml: 2 }}>
                    <IconButton
                      size="small"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {userRole.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleProfile}>Profile</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </Box>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;