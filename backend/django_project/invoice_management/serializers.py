from rest_framework import serializers
from .models import Invoice, InvoiceDetails

class InvoiceDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceDetails
        fields = ['description', 'quantity', 'unit_price', 'line_total']

class InvoiceSerializer(serializers.ModelSerializer):
    details = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = ['invoice_number', 'customer_name', 'date', 'details']

    def get_details(self, obj):
        invoice_details = InvoiceDetails.objects.filter(invoice=obj)
        return [
            {
                'description': detail.description,
                'quantity': detail.quantity,
                'unit_price': detail.unit_price,
                'line_total': detail.line_total
            }
            for detail in invoice_details
        ]
