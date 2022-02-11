from finvizfinance.quote import finvizfinance, Quote, Statements
from finvizfinance.util import util_dict
import yfinance as yf
from .cache import StockCache, FundamentalCache
from .technical import get_indicator

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) \
            AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'}

stock_cache = StockCache()
fundamental_cache = FundamentalCache()

def get_history_data(ticker, interval, period, indicators):
    '''get_history_data
    Get history data.

    Args:
        ticker(str): ticker symbol.
        interval(str): ticker interval. 
        period(str): ticker period.
        indicators(dict): get indicator options.
    Returns:
        data(dict): history data. 
    '''
    if stock_cache.find(ticker, interval, period):
        print('[Info] get history data from cache')
        df = stock_cache.retrive()
    else:
        print('[Info] fetch from yfinance')
        data = yf.download(
                tickers=ticker,
                period=period,
                interval=interval,
                group_by='ticker',
                auto_adjust=True,
                prepost=False,
                threads=True,
        )
        df = data.reset_index().dropna()
        df['Date'] = df['Date'].apply(lambda x: x.timestamp()*1000).astype(int)
        cols = ['Open', 'High', 'Low', 'Close']
        for col in cols:
            df[col] = df[col].apply(lambda x: round(x,2))
        stock_cache.cache(ticker, interval, period, df)
    data_date = df['Date'].values
    data_ohlcv = [df['Open'].values, df['High'].values, df['Low'].values, df['Close'].values, df['Volume'].values]
    data_volume = df['Volume'].values
        
    ticker_data = [[data_date[i], data_ohlcv[0][i], data_ohlcv[1][i], data_ohlcv[2][i], data_ohlcv[3][i]] for i in range(len(data_date))]
    ticker_volume = [[data_date[i], data_volume[i]] for i in range(len(data_date))]
    
    # get indicator
    indicators = get_indicator(df, indicators)

    data = {'data':ticker_data, 'volume': ticker_volume, 'indicators': indicators}
    return data

def get_current_market(ticker):
    '''get_current_market
    Get single ticker price and percentage change.

    Args:
        ticker(str): ticker symbol.
    Returns:
        info(dict): single ticker price and percentage change.
    '''
    if fundamental_cache.cache_lookup(ticker):
        print('[Info] Fundamental data from cache')
        stock_fundament = fundamental_cache.retrive(ticker)["fundament"]
    else:
        print('[Info] Fetch from finvizfinance')
        stock = finvizfinance(ticker)
        stock_info = stock.ticker_fundament(raw=False)
        stock_info['desp'] = stock.ticker_description()
        stock_news = stock.ticker_news()
        info = {
            "fundament": stock_info,
            "news": stock_news.to_dict(orient="records"),
        }
        fundamental_cache.cache(ticker, info)
        stock_fundament = stock_info
    return {
        "ticker": ticker,
        "current": stock_fundament['Price'],
        "chg": stock_fundament['Price'] - stock_fundament['Prev Close'],
        "pct": stock_fundament['Change']*100,
    }

def get_ticker_fundament(ticker):
    '''get_ticker_fundament
    Get single ticker fundament information.

    Args:
        ticker(str): ticker symbol.
    Returns:
        info(dict): single ticker fundament information and news.
    '''
    if fundamental_cache.cache_lookup(ticker):
        print('[Info] Fundamental data from cache')
        return fundamental_cache.retrive(ticker)
    else:
        print('[Info] Fetch from finvizfinance')
        stock = finvizfinance(ticker)
        stock_info = stock.ticker_fundament(raw=False)
        stock_info['desp'] = stock.ticker_description()
        stock_news = stock.ticker_news()
        info = {
            "fundament": stock_info,
            "news": stock_news.to_dict(orient="records"),
        }
        fundamental_cache.cache(ticker, info)
    
    return info

def get_ticker_statement(ticker, statement, timeframe):
    '''get_ticker_statement.
    Get single ticker fundament information.

    Args:
        ticker(str): ticker symbol.
        statement(str): statement code (I: Income Statement, B: Balance Sheet, C: Cash Flow).
        timeframe(str): timeframe code (A: Annual, Q: Quarter)
    Returns:
        info(dict): single ticker fundament information and news.
    '''
    df = Statements().get_statements(ticker, statement, timeframe)
    statement_info = df.to_dict('index')
    for k, v in statement_info.items():
        statement_info[k] = list(v.values())
    return {
        "header": list(statement_info.keys()),
        "data": statement_info
    }

def get_filters():
    '''get_filters
    Get filters from finvizfinance library.

    Returns:
        filters(dict): all available filters and filter options.
    '''
    return {
        'filters': list(util_dict['filter'].keys()),
        'filter_options': util_dict['filter']
    }

def validate_stock(stock):
    if Quote().getCurrent(stock) == 'NA':
        return False
    else:
        return True

def get_portfolio(portfolio):
    for i, holding in enumerate(portfolio):
        holding['price'] = float(Quote().get_current(holding['ticker']))
        holding['return'] = (holding['price'] - holding['cost']) * holding['shares']
        holding['pct'] = (holding['price'] - holding['cost'])*100 / holding['cost']
        holding['equity'] = holding['price'] * holding['shares']
        portfolio[i] = holding

if __name__ == "__main__":
    ticker = 'AAPL'
    # market_data = get_current_market(ticker)
    # print(market_data)
    # statement_info = get_ticker_statement(ticker, 'C', 'A')
    # print(statement_info)

    # filters = get_filters()
    # filter_options = {}
    # for k,v in filters['filter_options'].items():
    #     filter_options[k] = v['option']
    # print(filter_options)

    # data = get_history_data(ticker, '1mo')
    # print(data)

