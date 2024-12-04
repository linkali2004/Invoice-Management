import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    TablePagination,
    Divider, // Import TablePagination component
} from '@mui/material';
import { styled } from '@mui/system';
import CustomSnackbar from './CustomSnackbar';
import { useInvoices } from '../context/InvoiceContext';

const StyledModal = styled(Modal)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: theme.spacing(4),
    width: '90%',
    maxWidth: '650px',
    boxShadow: theme.shadows[10],
    border: '1px solid #e0e0e0',
    maxHeight: '80vh', // Ensure modal height is limited
    overflowY: 'auto', // Make the content scrollable
}));

const DetailSection = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#f7f8fa',
    borderRadius: '8px',
    boxShadow: theme.shadows[1],
}));

const HeaderText = styled(Typography)(({ theme }) => ({
    color: '#1a237e',
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    fontSize: '1.2rem',
}));

const DetailText = styled(Typography)(({ theme }) => ({
    color: '#000',
    marginBottom: theme.spacing(1),
    fontSize: '1rem',
    lineHeight: '1.5',
}));

const InvoiceTable = ({ invoices, isLoading }) => {
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [editedInvoice, setEditedInvoice] = useState(null);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [triggerInvoiceUpdate,setTriggerInvoiceUpdate] = useState(false);
    const {setIsDeleting} = useInvoices();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const fetchInvoiceDetails = async (invoiceNumber) => {
        setIsModalLoading(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/invoice-management/api/invoices/${invoiceNumber}`
            );
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setInvoiceDetails(data);
            } else {
                setSnackbar({
                    open: true,
                    message: 'Failed to fetch invoice details!',
                    severity: 'error',
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error fetching invoice details!',
                severity: 'error',
            });
        } finally {
            setIsModalLoading(false);
        }
    };
 
    useEffect(()=>{
        if(selectedInvoice?.invoiceNumber != null)
        {
            fetchInvoiceDetails(selectedInvoice.invoiceNumber);
        }
    },[triggerInvoiceUpdate])

    const handleViewDetails = (invoice) => {
        setSelectedInvoice(invoice);
        fetchInvoiceDetails(invoice.invoiceNumber);
        setViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setViewModalOpen(false);
        setInvoiceDetails(null);
    };

    const handleOpenEditModal = () => {
        setEditedInvoice({
            ...invoiceDetails,
            details: invoiceDetails.details || [{ description: '', quantity: '', unit_price: '' }],
        }); 
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setEditedInvoice(null);
    };

    const handleEditInvoice = async () => {
        try {
            const formattedData = {
                invoice_number: editedInvoice?.invoice_number,
                customer_name: editedInvoice?.customer_name,
                date: editedInvoice?.date,
                details: editedInvoice?.details?.map((detail) => ({
                    description: detail.description,
                    quantity: parseInt(detail.quantity),
                    unit_price: parseFloat(detail.unit_price),
                })) || [],
            };

            const response = await fetch(
                `http://127.0.0.1:8000/invoice-management/api/invoices/${editedInvoice?.invoice_number}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formattedData),
                }
            );

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: 'Invoice updated successfully!',
                    severity: 'success',
                });
                setEditModalOpen(false);
                setTriggerInvoiceUpdate((prev)=>!prev);
            } else {
                setSnackbar({
                    open: true,
                    message: 'Failed to update invoice!',
                    severity: 'error',
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error updating invoice!',
                severity: 'error',
            });
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/invoice-management/api/invoices/${selectedInvoice.invoiceNumber}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: 'Invoice deleted successfully!',
                    severity: 'success',
                });
                setViewModalOpen(false);
                setIsDeleting((prev)=>!prev);
            } else {
                setSnackbar({
                    open: true,
                    message: 'Failed to delete invoice!',
                    severity: 'error',
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error deleting invoice!',
                severity: 'error',
            });
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const closeSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const paginatedInvoices = invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleDetailChange = (index, field, value) => {
        const updatedDetails = [...editedInvoice.details];
        updatedDetails[index][field] = value;
        setEditedInvoice({ ...editedInvoice, details: updatedDetails });
    };

    const handleAddDetail = () => {
        setEditedInvoice({
            ...editedInvoice,
            details: [...editedInvoice.details, { description: '', quantity: '', unit_price: '' }],
        });
    };

    const handleRemoveDetail = (index) => {
        const updatedDetails = editedInvoice.details.filter((_, i) => i !== index);
        setEditedInvoice({ ...editedInvoice, details: updatedDetails });
    };

    return (
        <>
            <TableContainer sx={{ mt: 3, boxShadow: 4, borderRadius: '12px', overflow: 'hidden' }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <CircularProgress sx={{ color: '#1a237e' }} />
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Invoice Number</TableCell>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>View Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedInvoices.map((invoice, index) => (
                                <TableRow key={index}>
                                    <TableCell>{invoice.invoiceNumber}</TableCell>
                                    <TableCell>{invoice.customerName}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" onClick={() => handleViewDetails(invoice)}>
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={invoices.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            
            <StyledModal open={viewModalOpen} onClose={handleCloseViewModal}>
                <ModalContent>
                    {isModalLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        invoiceDetails && (
                            <>
                                <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: '600' }}>
                                    Invoice Details
                                </Typography>
                                <DetailSection>
                                    <HeaderText>Invoice Number: {invoiceDetails.invoice_number}</HeaderText>
                                    <DetailText>Customer: {invoiceDetails.customer_name}</DetailText>
                                    <DetailText>Date: {invoiceDetails.date}</DetailText>

                                    <HeaderText sx={{ marginTop: 2 }}>Details</HeaderText>
                                    {invoiceDetails.details.map((detail, index) => (
                                        <>
                                        <DetailText key={index + 'b'}>
                                           Invoice Description:  {detail.description} 
                                        </DetailText>
                                        <DetailText key = {index+'a'}>
                                            Invoice quantity : {detail.quantity}
                                        </DetailText>
                                        <DetailText key = {index + 'c'}>
                                         Invoice Unit Price: {detail.unit_price}
                                        </DetailText>
                                        <DetailText key = {index + 'd'}>
                                         Invoice Line total: {detail.line_total}
                                        </DetailText>
                                        <Divider></Divider>
                                        </>
                                    ))}
                                   
                                </DetailSection>

                                <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button variant="outlined" onClick={handleCloseViewModal}>
                                        Close
                                    </Button>
                                    <Button variant="contained" onClick={handleOpenEditModal}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="error" onClick={handleDelete}>
                                        Delete
                                    </Button>
                                </Box>
                            </>
                        )
                    )}
                </ModalContent>
            </StyledModal>

            {/* Edit Modal */}
            <StyledModal open={editModalOpen} onClose={handleCloseEditModal}>
                <ModalContent>
                    {editedInvoice ? (
                        <Box>
                            <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: '600', marginBottom: '16px' }}>
                                Edit Invoice
                            </Typography>

                            <TextField
                                label="Invoice Number"
                                value={editedInvoice.invoice_number}
                                onChange={(e) =>
                                    setEditedInvoice({ ...editedInvoice, invoice_number: e.target.value })
                                }
                                fullWidth
                                disabled
                            />
                            <TextField
                                label="Customer Name"
                                value={editedInvoice.customer_name}
                                onChange={(e) =>
                                    setEditedInvoice({ ...editedInvoice, customer_name: e.target.value })
                                }
                                fullWidth
                                sx={{ marginTop: 2 }}
                            />
                            <TextField
                                label="Date"
                                type="date"
                                value={editedInvoice.date}
                                onChange={(e) =>
                                    setEditedInvoice({ ...editedInvoice, date: e.target.value })
                                }
                                fullWidth
                                sx={{ marginTop: 2 }}
                            />

                            <HeaderText sx={{ marginTop: 3 }}>Invoice Details</HeaderText>
                            {editedInvoice.details.map((detail, index) => (
                                <Box key={index} sx={{ marginTop: 2 }}>
                                    <TextField
                                        label="Description"
                                        value={detail.description}
                                        onChange={(e) =>
                                            handleDetailChange(index, 'description', e.target.value)
                                        }
                                        fullWidth
                                    />
                                    <Box sx={{ display: 'flex', marginTop: 2 }}>
                                        <TextField
                                            label="Quantity"
                                            value={detail.quantity}
                                            onChange={(e) =>
                                                handleDetailChange(index, 'quantity', e.target.value)
                                            }
                                            fullWidth
                                        />
                                        <TextField
                                            label="Unit Price"
                                            value={detail.unit_price}
                                            onChange={(e) =>
                                                handleDetailChange(index, 'unit_price', e.target.value)
                                            }
                                            fullWidth
                                            sx={{ marginLeft: 2 }}
                                        />
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRemoveDetail(index)}
                                        sx={{ marginTop: 1 }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            ))}

                            <Button
                                variant="outlined"
                                onClick={handleAddDetail}
                                sx={{ marginTop: 2 }}
                            >
                                Add Detail
                            </Button>

                            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Button variant="outlined" onClick={handleCloseEditModal}>
                                    Cancel
                                </Button>
                                <Button variant="contained" onClick={handleEditInvoice}>
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <CircularProgress />
                    )}
                </ModalContent>
            </StyledModal>

            {/* Snackbar */}
            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={closeSnackbar}
            />
        </>
    );
};

export default InvoiceTable;
