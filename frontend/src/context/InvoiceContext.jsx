import React, { createContext, useState, useContext, useEffect } from "react";

const InvoiceContext = createContext();

export const useInvoices = () => {
  return useContext(InvoiceContext);
};

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [deleting,setIsDeleting] = useState(false);
  const fetchInvoices = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/invoice-management/api/invoices");
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);  
      } else {
        console.error('Failed to fetch invoices');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const addInvoice = (invoice) => {
    setInvoices((prevInvoices) => [...prevInvoices, invoice]);
  };

  useEffect(() => {
    fetchInvoices();  
  }, []);

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, fetchInvoices ,deleting,setIsDeleting}}>
      {children}
    </InvoiceContext.Provider>
  );
};
