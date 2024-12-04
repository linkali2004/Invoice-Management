from django.contrib import admin
from .models import Invoice, InvoiceDetails
from .forms import InvoiceForm,InvoiceDetailsForm


class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'customer_name', 'date']
    form = InvoiceForm


class InvoiceDetailsAdmin(admin.ModelAdmin):
    list_display = ['invoice', 'quantity', 'description','unit_price']
    form = InvoiceDetailsForm


admin.site.register(Invoice, InvoiceAdmin)
admin.site.register(InvoiceDetails,InvoiceDetailsAdmin)
