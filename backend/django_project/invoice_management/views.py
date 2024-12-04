from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Invoice, InvoiceDetails
from .serializers import InvoiceSerializer,InvoiceDetailsSerializer

class InvoiceListView(APIView):
    def get(self, request):
        """
        Retrieve all invoices
        """
        try:
            invoices = Invoice.objects.all()
            serializer = InvoiceSerializer(invoices, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        """
        Create a new invoice
        """
        try:
            invoice_data = {
                'invoice_number': request.data.get('invoice_number'),
                'customer_name': request.data.get('customer_name'),
                'date': request.data.get('date')
            }
            invoice = Invoice.objects.create(**invoice_data)
            details = request.data.get('details', [])
            for detail in details:
                quantity = detail.get('quantity')
                unit_price = detail.get('unit_price')
                line_total = quantity * unit_price

                InvoiceDetails.objects.create(
                    invoice=invoice,
                    description=detail.get('description'),
                    quantity=quantity,
                    unit_price=unit_price,
                    line_total=line_total
                )

            serializer = InvoiceSerializer(invoice)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class InvoiceDetailView(APIView):
    def get(self, request, invoice_number):
        try:
            invoice = get_object_or_404(Invoice, invoice_number=invoice_number)
            serializer = InvoiceSerializer(invoice)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, invoice_number):
            try:
                invoice = get_object_or_404(Invoice, invoice_number=invoice_number)
                invoice.invoice_number = request.data.get('invoice_number', invoice.invoice_number)
                invoice.customer_name = request.data.get('customer_name', invoice.customer_name)
                invoice.date = request.data.get('date', invoice.date)
                invoice.save()

                details = request.data.get('details', [])
                InvoiceDetails.objects.filter(invoice=invoice).delete()

                for detail in details:
                    quantity = detail.get('quantity')
                    unit_price = detail.get('unit_price')
                    line_total = quantity * unit_price if quantity and unit_price else 0

                    InvoiceDetails.objects.create(
                        invoice=invoice,
                        description=detail.get('description'),
                        quantity=quantity,
                        unit_price=unit_price,
                        line_total=line_total
                    )

                serializer = InvoiceSerializer(invoice)
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            except Exception as e:
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )


    def delete(self, request, invoice_number):
        try:
            if not invoice_number:
                return Response(
                    {'error': 'Invalid invoice number'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            invoice = get_object_or_404(Invoice, invoice_number=invoice_number)
            invoice.delete()
            return Response(
                {'message': 'Invoice deleted successfully'},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )