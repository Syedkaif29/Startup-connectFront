import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Paper, 
  CircularProgress, 
  Chip, 
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import transactionService from '../services/transactionService';
import { useNavigate } from 'react-router-dom';

const InvestmentsReceived = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getTransactionsByStartup();
      console.log('Fetched transactions:', data);
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTransaction(null);
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
    switch (status?.toUpperCase()) {
      case 'ACCEPTED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getInvestorDisplayName = (transaction) => {
    return transaction.investorCompanyName || 
           transaction.investorName || 
           `Investor #${transaction.investorId}` || 
           'Unknown Investor';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Investments Received
      </Typography>
      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Investor</TableCell>
                    <TableCell>Startup</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No transactions found.</TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id} hover>
                        <TableCell>{getInvestorDisplayName(tx)}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {tx.startupName || 'Unknown Startup'}
                          </Typography>
                          {tx.startupStage && (
                            <Typography variant="caption" color="textSecondary">
                              {tx.startupStage}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">${tx.amount?.toLocaleString()}</TableCell>
                        <TableCell>{tx.transactionType ?? '-'}</TableCell>
                        <TableCell>{formatDate(tx.transactionDate)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={tx.status || 'PENDING'} 
                            color={getStatusColor(tx.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleOpenDialog(tx)}>
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Transaction Details</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedTransaction && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <b>Startup:</b> {selectedTransaction.startupName || 'Unknown Startup'}
              </Typography>
              {selectedTransaction.startupStage && (
                <Typography variant="subtitle1" gutterBottom>
                  <b>Stage:</b> {selectedTransaction.startupStage}
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                <b>Investor:</b> {getInvestorDisplayName(selectedTransaction)}
              </Typography>
              {selectedTransaction.investorDetails && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    <b>Investor Email:</b> {selectedTransaction.investorDetails.email || '-'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <b>Location:</b> {selectedTransaction.investorDetails.location || '-'}
                  </Typography>
                </>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                <b>Amount:</b> ${selectedTransaction.amount?.toLocaleString() || '-'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <b>Type:</b> {selectedTransaction.transactionType ?? '-'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <b>Status:</b> 
                <Chip 
                  label={selectedTransaction.status || 'PENDING'} 
                  color={getStatusColor(selectedTransaction.status)} 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <b>Date:</b> {formatDate(selectedTransaction.transactionDate)}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <b>Description:</b> {selectedTransaction.description || '-'}
              </Typography>
              {selectedTransaction.terms && (
                <Typography variant="subtitle1" gutterBottom>
                  <b>Terms:</b> {selectedTransaction.terms}
                </Typography>
              )}
              {selectedTransaction.equity && (
                <Typography variant="subtitle1" gutterBottom>
                  <b>Equity:</b> {selectedTransaction.equity}%
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

export default InvestmentsReceived;
