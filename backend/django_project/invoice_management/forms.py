from django import forms

from .models import Invoice,InvoiceDetails


class InvoiceForm(forms.ModelForm):
    class Meta:
        model = Invoice
        fields = ['invoice_number','customer_name','date']


class InvoiceDetailsForm(forms.ModelForm):
    class Meta:
        model = InvoiceDetails
        fields = ['invoice','description','quantity','unit_price']
        