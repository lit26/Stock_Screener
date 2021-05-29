from datetime import datetime, timedelta

TIME_UPDATE = 15

class StockCache:
    def __init__(self):
        self._ticker = ""
        self._interval = ""
        self._period = ""
    
    def find(self, ticker, interval, period):
        if self._ticker == ticker and self._interval == interval and self._period == period:
            return True
        return False
    
    def cache(self, ticker, interval, period, df):
        self._ticker = ticker
        self._interval = interval
        self._period = period
        self._df = df
    
    def retrive(self):
        return self._df

class FundamentalCache:
    def __init__(self):
        self._fundamental = {}
        self._latest = {}
    
    def cache_lookup(self, ticker):
        if ticker in self._fundamental:
            current = datetime.now()
            timedelta = current - self._latest[ticker]
            minutes = timedelta.total_seconds() / 60
            if minutes <= TIME_UPDATE:
                return True
        return False
    
    def cache(self, ticker, info):
        self._fundamental[ticker] = info
        self._latest[ticker] = datetime.now()
    
    def retrive(self, ticker):
        return self._fundamental[ticker]