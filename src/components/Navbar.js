import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    useTheme,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ darkMode, toggleTheme }) => {
    const theme = useTheme();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    Startup Connect
                </Typography>
                <Box>
                    <Button color="inherit" component={RouterLink} to="/investors">
                        Investors
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/portfolio">
                        Portfolio
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/startup-dashboard">
                        Startup Dashboard
                    </Button>
                    <IconButton onClick={toggleTheme} color="inherit">
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 