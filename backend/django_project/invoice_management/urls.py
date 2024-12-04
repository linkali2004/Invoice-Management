from django.urls import path
from . import views

urlpatterns = [
    path('api/invoices', views.InvoiceListView.as_view(), name='invoice-list'),
    path('api/invoices/<str:invoice_number>', views.InvoiceDetailView.as_view(), name='invoice-detail'),
]