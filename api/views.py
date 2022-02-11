from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response
from .ticker import get_history_data, get_current_market, get_ticker_fundament, get_ticker_statement, get_portfolio, validate_stock
from .screener import get_screener
from .models import Portfolio
from .serializers import PortfolioSerializer

class QuoteView(views.APIView):
    def post(self, request, pk, tf, pr):
        '''post
        Args:
            pk(str): ticker symbol
            tf(str): timeframe
            pr(str): period
        '''
        indicators = request.data['indicators']
        data = get_history_data(pk, tf, pr, indicators)
        return Response(data)

class TickersView(views.APIView):
    def get(self, request):
        '''get
        Test Url
        '''
        return Response('TickersView') 

    def post(self, request):
        '''post
        Get multi ticker market value and percentage
        Sample post data: {"tickers": ["AAPL","TSLA"]}
        '''
        tickers = request.data['tickers']
        watchlist = []
        for ticker in tickers:
            print(get_current_market(ticker))
            watchlist.append(get_current_market(ticker))
        return Response(watchlist)

class TickerView(views.APIView):
    def get(self, request, pk):
        '''get
        Get ticker information
        Args:
            pk(str): ticker symbol
        '''
        return Response(get_ticker_fundament(pk))

class StatementsView(views.APIView):
    def get(self, request, pk, st, tf):
        '''get
        Get ticker statements information
        Args:
            pk(str): ticker symbol
            st(str): statement code
            tf(str): timeframe
        '''
        return Response(get_ticker_statement(pk, st, tf))

class ScreenerView(views.APIView):
    def get(self, request, pk):
        '''get
        Check which screener
        Args:
            pk(str): screener type
        '''
        return Response(pk)
    
    # {"filter":{"Exchange":"AMEX","Sector":"Basic Materials"},"order": "company", "page":1, "ascend": false}
    def post(self, request, pk):
        '''post
        Get the screener according to the post data
        Args:
            pk(str): screener type
        '''
        filters = request.data['filter']
        if not filters:
            filters = None
        order = request.data['order']
        
        page = request.data['page']
        ascend = request.data['ascend']
        df, page = get_screener(pk, filters=filters, order=order, page=page, ascend=ascend)

        if page == 0:
            return Response('Not Found', status=status.HTTP_404_NOT_FOUND)
        else:
            df = df.fillna('')
            response = df.to_dict(orient="records")
            return Response({'data':response,'header':list(df.columns), 'page': page})

class PortfolioView(views.APIView):
    def get(self, request, pk=None):
        '''get
        Get all the stocks in the portfolio
        '''
        try:
            queryset = Portfolio.objects.all()
            serializer = PortfolioSerializer(queryset, many=True)
            get_portfolio(serializer.data)
            return Response(serializer.data)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        '''post
        Add stock to your portfolio
        '''
        serializer = PortfolioSerializer(data=request.data)
        validate = validate_stock(request.data['ticker'])
        if serializer.is_valid() and validate:
            serializer.save()
            queryset = Portfolio.objects.all()
            serializer = PortfolioSerializer(queryset, many=True)
            get_portfolio(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        '''put
        Update the portfolio
        Args:
            pk(int): id
        '''
        stock = Portfolio.objects.get(pk=pk) 
        serializer = PortfolioSerializer(stock, data=request.data)
        if serializer.is_valid():
            serializer.save()
            queryset = Portfolio.objects.all()
            serializer = PortfolioSerializer(queryset, many=True)
            get_portfolio(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        '''delete
        Delete a stock in the portfolio
        Args:
            pk(int): id
        '''
        stock = get_object_or_404(Portfolio, id=pk)
        stock.delete()
        return Response({'msg': 'done'}, status=status.HTTP_204_NO_CONTENT)
