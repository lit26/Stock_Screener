from django.urls import path
from .views import TickerView, TickersView, StatementsView, ScreenerView, QuoteView, PortfolioView

# http://127.0.0.1:8000/api/market/
urlpatterns = [
    path('market/', TickersView.as_view()),
    path('info/<str:pk>', TickerView.as_view()),
    path('statement/<str:pk>/<str:st>/<str:tf>', StatementsView.as_view()), 
    path('screener/<str:pk>', ScreenerView.as_view()),
    path('portfolio/', PortfolioView.as_view()),
    path('portfolio/<int:pk>', PortfolioView.as_view()),
    path('quote/q=<str:pk>&t=<str:tf>&p=<str:pr>',QuoteView.as_view()),
]