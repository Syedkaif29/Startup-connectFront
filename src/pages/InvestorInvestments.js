import React, { useEffect, useState, useCallback } from 'react';
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, IconButton, Tooltip, Alert, Box
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import transactionService from '../services/transactionService';
import startupService from '../services/startupService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const InvestorInvestments = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedInvestment, setSelectedInvestment] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [startupDetails, setStartupDetails] = useState({});

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            console.log('Fetching investments...');
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }
            
            const decodedToken = jwtDecode(user.token);
            console.log('Decoded token:', decodedToken);
            
            // Get the email from the token
            const email = decodedToken.sub;
            if (!email) {
                throw new Error('Could not find email in token');
            }
            
            console.log('Using email:', email);
            const data = await transactionService.getTransactionsByInvestor(email);
            console.log('Fetched investments:', data);
            
            // No need to fetch startup details separately as they're included in the DTO
            setTransactions(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching investments:', err);
            if (err.response?.status === 403) {
                setError('You do not have permission to view investments. Please ensure you are logged in as an investor.');
            } else {
                setError(err.message || 'Failed to fetch investments');
            }
        } finally {
            setLoading(false);
        }
    };

    const checkAuthAndFetchData = useCallback(async () => {
        try {
            const user = authService.getCurrentUser();
            console.log('Current user:', user);

            if (!user) {
                setError('Please log in to view your investments');
                navigate('/login');
                return;
            }

            // Check both user.role and token roles
            const hasInvestorRole = user.user?.role === 'INVESTOR';
            let tokenRoles = [];
            
            try {
                if (user.token) {
                    const decodedToken = jwtDecode(user.token);
                    tokenRoles = decodedToken.roles || [];
                }
            } catch (err) {
                console.error('Error decoding token:', err);
            }

            console.log('User role:', user.user?.role);
            console.log('Token roles:', tokenRoles);

            const hasInvestorAccess = hasInvestorRole || 
                tokenRoles.some(role => ['ROLE_INVESTOR', 'INVESTOR'].includes(role));

            console.log('Has investor access:', hasInvestorAccess);

            if (!hasInvestorAccess) {
                setError('You must be an investor to view this page. Current role: ' + (user.user?.role || 'none'));
                return;
            }

            await fetchTransactions();
        } catch (err) {
            console.error('Auth check error:', err);
            setError(err.message);
        }
    }, [navigate]);

    useEffect(() => {
        checkAuthAndFetchData();
    }, [checkAuthAndFetchData]);

    const handleOpenDialog = (transaction) => {
        setSelectedInvestment(transaction);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedInvestment(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        if (status === 'ACCEPTED') return 'success';
        if (status === 'PENDING') return 'warning';
        return 'default';
    };

    const getStartupDisplayName = (transaction) => {
        return transaction.startupName || 'Unknown Startup';
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Investments
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {loading ? (
                <CircularProgress />
            ) : !error && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Startup</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No transactions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body1">
                                                    {getStartupDisplayName(transaction)}
                                                </Typography>
                                                {transaction.startupStage && (
                                                    <Typography variant="body2" color="textSecondary">
                                                        {transaction.startupStage}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>${transaction.amount?.toLocaleString()}</TableCell>
                                        <TableCell>{transaction.transactionType || '-'}</TableCell>
                                        <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={transaction.status || 'Unknown'}
                                                color={getStatusColor(transaction.status)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(transaction)}
                                            >
                                                <InfoIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {/* Investment Details Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h6">Transaction Details</Typography>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedInvestment && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                <b>Startup:</b> {getStartupDisplayName(selectedInvestment)}
                            </Typography>
                            {selectedInvestment.startupStage && (
                                <Typography variant="subtitle1" gutterBottom>
                                    <b>Stage:</b> {selectedInvestment.startupStage}
                                </Typography>
                            )}
                            <Typography variant="subtitle1" gutterBottom>
                                <b>Amount:</b> ${selectedInvestment.amount?.toLocaleString()}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                <b>Type:</b> {selectedInvestment.transactionType || '-'}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                <b>Date:</b> {formatDate(selectedInvestment.transactionDate)}
                            </Typography>
                            {selectedInvestment.status && (
                                <Typography variant="subtitle1" gutterBottom>
                                    <b>Status:</b> {selectedInvestment.status}
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default InvestorInvestments;
