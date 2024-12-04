import React, { useState, useEffect } from 'react';
import Header from './Components/Header';
import InvoiceTable from './Components/InvoiceTable';
import InvoiceModal from './Components/InvoiceModal';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useInvoices } from './context/InvoiceContext';

const App = () => {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const { addInvoice ,deleting} = useInvoices();

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                'http://127.0.0.1:8000/invoice-management/api/invoices'
            );
            const data = await response.json();
            const formattedInvoices = data.map((invoice) => ({
                invoiceNumber: invoice.invoice_number,
                customerName: invoice.customer_name,
                date: invoice.date,
                details: invoice.details,
            }));
            setInvoices(formattedInvoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [addInvoice,deleting]);
    
    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleNewInvoice = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
    const handleSaveInvoice = (newInvoice) => {
        setInvoices((prev) => [...prev, newInvoice]);
    };

    const handleViewDetails = (invoice) => {
        alert(`Viewing details for invoice #${invoice.invoiceNumber}`);
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#283593',
                padding: 4,
                color: 'white',
            }}
        >
            <Box
                sx={{
                    width: '90%',
                    maxWidth: '800px',
                    borderRadius: 4,
                    boxShadow: 6,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    p: 3,
                }}
            >
                <Header invoiceCount={invoices.length} onNewInvoice={handleNewInvoice} />
                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '200px',
                        }}
                    >
                        <CircularProgress sx={{ color: 'white' }} />
                    </Box>
                ) : invoices.length > 0 ? (
                    <InvoiceTable
                        invoices={invoices}
                        isLoading={isLoading}
                        onViewDetails={handleViewDetails}
                    />
                ) : (
                    <Typography variant="h6" align="center" sx={{ mt: 2, color: 'white' }}>
                        No invoices available.
                    </Typography>
                )}
                <InvoiceModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveInvoice}
                />
            </Box>
        </Box>
    );
};

export default App;
