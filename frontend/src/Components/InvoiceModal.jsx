import React, { useState } from 'react';
import { useInvoices } from "../context/InvoiceContext";
import { TextField, Grid, Button } from '@mui/material';
import CustomModal from './CustomModal';

const InvoiceModal = ({ open, onClose }) => {
    const { addInvoice, fetchInvoices } = useInvoices(); 
    const [formData, setFormData] = useState({
        invoiceNumber: '',
        customerName: '',
        date: '',
        details: [
            {
                description: '',
                quantity: '',
                unit_price: '',
            },
        ],
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDetailChange = (index, e) => {
        const updatedDetails = [...formData.details];
        updatedDetails[index][e.target.name] = e.target.value;
        setFormData({ ...formData, details: updatedDetails });
    };

    const handleAddDetail = () => {
        setFormData({
            ...formData,
            details: [
                ...formData.details,
                { description: '', quantity: '', unit_price: '' },
            ],
        });
    };

    const validateField = (name, value, index) => {
        if (name === 'invoiceNumber') {
            if (!value) return 'Invoice Number is required';
            if (!Number.isInteger(Number(value))) return 'Invoice Number must be an integer';
        }
        if (name === 'customerName' || name === 'description') {
            if (!value) return `${name.replace(/([A-Z])/g, ' $1').toUpperCase()} is required`;
        }
        if (name === 'date') {
            if (!value) return 'Date is required';
        }
        if (name === 'quantity') {
            if (!value) return 'Quantity is required';
            if (!Number.isInteger(Number(value))) return 'Quantity must be an integer';
        }
        if (name === 'unit_price') {
            if (!value) return 'Unit Price is required';
            if (!Number.isFinite(Number(value))) return 'Unit Price must be a number';
        }
        return '';
    };

    const validateForm = () => {
        const newErrors = {};

        formData.details.forEach((detail, index) => {
            Object.keys(detail).forEach(field => {
                const error = validateField(field, detail[field], index);
                if (error) newErrors[`details[${index}].${field}`] = error;
            });
        });

        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSave = async () => {
        if (validateForm()) {
            const formattedDate = formatDate(formData.date);

            const updatedFormData = {
                ...formData,
                date: formattedDate,
                details: formData.details.map(detail => ({
                    description: detail.description,
                    quantity: parseInt(detail.quantity, 10),
                    unit_price: parseFloat(detail.unit_price),
                })),
            };

            try {
                const response = await fetch("http://127.0.0.1:8000/invoice-management/api/invoices", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        invoice_number: updatedFormData.invoiceNumber,
                        customer_name: updatedFormData.customerName,
                        date: updatedFormData.date,
                        details: updatedFormData.details,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    addInvoice(data);
                    fetchInvoices();
                    handleCancel(); // Reset the form and close the modal
                } else {
                    console.error('Failed to save invoice:', response.statusText);
                }
            } catch (error) {
                console.error('Error while saving invoice:', error);
            }
        }
    };

    const handleCancel = () => {
        setFormData({
            invoiceNumber: '',
            customerName: '',
            date: '',
            details: [
                {
                    description: '',
                    quantity: '',
                    unit_price: '',
                },
            ],
        });
        setErrors({});
        onClose(); // Close the modal
    };

    return (
        <CustomModal
            open={open}
            onClose={handleCancel}
            title="Add New Invoice"
        >
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <TextField
                    label="Invoice Number"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                    onBlur={() => setErrors({ ...errors, invoiceNumber: validateField('invoiceNumber', formData.invoiceNumber) })}
                    fullWidth
                    margin="normal"
                    error={!!errors.invoiceNumber}
                    helperText={errors.invoiceNumber}
                />
                <TextField
                    label="Customer Name"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    onBlur={() => setErrors({ ...errors, customerName: validateField('customerName', formData.customerName) })}
                    fullWidth
                    margin="normal"
                    error={!!errors.customerName}
                    helperText={errors.customerName}
                />
                <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    onBlur={() => setErrors({ ...errors, date: validateField('date', formData.date) })}
                    fullWidth
                    margin="normal"
                    error={!!errors.date}
                    helperText={errors.date}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Grid container spacing={2} mt={2}>
                    {formData.details.map((detail, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={detail.description}
                                    onChange={(e) => handleDetailChange(index, e)}
                                    onBlur={() => setErrors({ ...errors, [`details[${index}].description`]: validateField('description', detail.description, index) })}
                                    error={!!errors[`details[${index}].description`]}
                                    helperText={errors[`details[${index}].description`]}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    name="quantity"
                                    value={detail.quantity}
                                    onChange={(e) => handleDetailChange(index, e)}
                                    onBlur={() => setErrors({ ...errors, [`details[${index}].quantity`]: validateField('quantity', detail.quantity, index) })}
                                    error={!!errors[`details[${index}].quantity`]}
                                    helperText={errors[`details[${index}].quantity`]}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Unit Price"
                                    name="unit_price"
                                    value={detail.unit_price}
                                    onChange={(e) => handleDetailChange(index, e)}
                                    onBlur={() => setErrors({ ...errors, [`details[${index}].unit_price`]: validateField('unit_price', detail.unit_price, index) })}
                                    error={!!errors[`details[${index}].unit_price`]}
                                    helperText={errors[`details[${index}].unit_price`]}
                                />
                            </Grid>
                        </React.Fragment>
                    ))}
                    <Grid item xs={12}>
                        <Button onClick={handleAddDetail}>Add Detail</Button>
                    </Grid>
                </Grid>
                <Grid container justifyContent="flex-end" spacing={2} mt={2}>
                    <Grid item>
                        <Button variant="outlined" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </CustomModal>
    );
};

export default InvoiceModal;
