import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, IconButton, Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import investorService from '../services/investorService';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const InvestorInvestments = () => {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
const [selectedInvestment, setSelectedInvestment] = useState(null);
const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            const data = await investorService.getMyInvestments();
            setInvestments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (investment) => {
    setSelectedInvestment(investment);
    setOpenDialog(true);
};

const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInvestment(null);
};

return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Investments
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Startup</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Offer Title</TableCell>
                                <TableCell>Equity (%)</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {investments.length === 0 ? (
    <>
        <TableRow>
            <TableCell colSpan={7} align="center">
                No investments found.
            </TableCell>
        </TableRow>
        {/* Sample static row for demonstration */}
        <TableRow>
            <TableCell>Sample Startup</TableCell>
            <TableCell>Seed Funding Round</TableCell>
            <TableCell>$10,000</TableCell>
            <TableCell>5%</TableCell>
            <TableCell><Chip label="APPROVED" color="success" size="small" /></TableCell>
            <TableCell>2025-04-21</TableCell>
            <TableCell>
                <Tooltip title="View Details">
                    <IconButton size="small">
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    </>
) : (
    investments.map((investment) => {
        const startupName = investment.offer?.startup?.name || investment.offer?.startupProfile?.startupName || '-';
        const offerTitle = investment.offer?.title || '-';
        const amount = investment.amount ? `$${Number(investment.amount).toLocaleString()}` : '-';
        const equity = investment.offer?.equityPercentage || investment.offer?.equity || '-';
        const status = investment.status || '-';
        const date = investment.createdAt ? new Date(investment.createdAt).toLocaleDateString() : '-';
        return (
            <TableRow key={investment.id} hover>
                <TableCell>{startupName}</TableCell>
                <TableCell>{offerTitle}</TableCell>
                <TableCell>{amount}</TableCell>
                <TableCell>{equity}</TableCell>
                <TableCell>
                    <Chip
                        label={status}
                        color={status === 'APPROVED' || status === 'COMPLETED' ? 'success' : status === 'PENDING' ? 'warning' : 'default'}
                        size="small"
                    />
                </TableCell>
                <TableCell>{date}</TableCell>
                <TableCell>
                    <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleOpenDialog(investment)}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
        );
    })
)}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        {/* Investment Details Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Investment Details</DialogTitle>
            <DialogContent dividers>
                {selectedInvestment && (
                    <>
                        <Typography variant="subtitle1"><b>Startup:</b> {selectedInvestment.offer?.startup?.name || selectedInvestment.offer?.startupProfile?.startupName || '-'}</Typography>
                        <Typography variant="subtitle1"><b>Offer Title:</b> {selectedInvestment.offer?.title || '-'}</Typography>
                        <Typography variant="subtitle1"><b>Amount:</b> ${selectedInvestment.amount?.toLocaleString() || '-'}</Typography>
                        <Typography variant="subtitle1"><b>Equity:</b> {selectedInvestment.offer?.equityPercentage || selectedInvestment.offer?.equity || '-'}%</Typography>
                        <Typography variant="subtitle1"><b>Status:</b> {selectedInvestment.status || '-'}</Typography>
                        <Typography variant="subtitle1"><b>Date:</b> {selectedInvestment.createdAt ? new Date(selectedInvestment.createdAt).toLocaleDateString() : '-'}</Typography>
                        <Typography variant="subtitle1"><b>Description:</b> {selectedInvestment.offer?.description || '-'}</Typography>
                    </>
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
