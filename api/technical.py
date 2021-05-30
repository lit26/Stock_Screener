from ta.momentum import (
    RSIIndicator,
    StochasticOscillator,
)
from ta.trend import (
    MACD,
    EMAIndicator,
)
from ta.volatility import (
    BollingerBands,
)

UP_COLOR = '#26a69a'
DOWN_COLOR = '#f44336'

def get_indicator(df, indicators):
    overlays_plot = []
    oscillators_plot = []

    # overlay plots
    if indicators['overlay'] == 'ema':
        overlays_plot = ema_plot(df)
    elif indicators['overlay'] == 'bb':
        overlays_plot = bb_plot(df)

    # oscillators plots
    if indicators['oscillator'] == 'macd':
        oscillators_plot = macd_plot(df)
    elif indicators['oscillator'] == 'rsi':
        oscillators_plot = rsi_plot(df)
    elif indicators['oscillator'] == 'stoch':
        oscillators_plot = stoch_plot(df)
    return overlays_plot + oscillators_plot

def round_series(df, cols):
    '''round_series
    round numbers to two decimal
    Args:
        df(dataframe): the ticker history
        cols(list): the columns to round number
    Returns:
        df(dataframe): the ticker history
    '''
    for col in cols:
        df[col] = df[col].apply(lambda x: round(x, 2))
    return df

def ema_plot(df):
    '''ema_plot
    plot the ema

    Args:
        df(dataframe): the ticker history
    Returns:
        overlays(list): the overlay plots for the frontend
    '''
    df2 = df.copy()
    df2["ema"] = EMAIndicator(close=df2["Close"], window=9, fillna=False).ema_indicator()
    df2 = round_series(df2, ["ema"])
    df2 = df2.dropna()
    data_date2 = df2['Date'].values
    ema = df2['ema'].values
    overlays = [{
        'type':'line',
        'color': 'rgb(255, 235, 59)',
        'name': 'ema',
        'dashStyle': 'solid',
        'data': [[data_date2[i], ema[i]] for i in range(len(df2))],
        'yAxis': 0
    }]
    return overlays

def bb_plot(df):
    '''bb_plot
    plot the bollinger bands

    Args:
        df(dataframe): the ticker history
    Returns:
        overlays(list): the plot series for the frontend
    '''
    df2 = df.copy()
    indicator = BollingerBands(
        close=df['Close'], window=20, window_dev=2, fillna=False
    )
    df2["bb_bbm"] = indicator.bollinger_mavg()
    df2["bb_bbh"] = indicator.bollinger_hband()
    df2["bb_bbl"] = indicator.bollinger_lband()
    cols = ["bb_bbm", "bb_bbh", "bb_bbl"]
    df2 = round_series(df2, cols)
    df2 = df2.dropna()
    data_date2 = df2['Date'].values
    bbm = df2['bb_bbm'].values
    bbl = df2['bb_bbl'].values
    bbh = df2['bb_bbh'].values
    overlays = [{
        'type':'line',
        'color': 'rgb(135, 35, 35)',
        'name': 'BB_m',
        'dashStyle': 'solid',
        'data': [[data_date2[i], bbm[i]] for i in range(len(df2))],
        'yAxis': 0
    }, {
        'type':'line',
        'color': 'rgb(0, 137, 123)',
        'name': 'BB_l',
        'dashStyle': 'solid',
        'data': [[data_date2[i], bbl[i]] for i in range(len(df2))],
        'yAxis': 0
    }, {
        'type':'line',
        'color': 'rgb(0, 137, 123)',
        'name': 'BB_h',
        'dashStyle': 'solid',
        'data': [[data_date2[i], bbh[i]] for i in range(len(df2))],
        'yAxis': 0
    }]
    return overlays

def macd_plot(df):
    '''macd_plot
    plot macd

    Args:
        df(dataframe): the ticker history
    Returns:
        oscillators(list): the plot series for the frontend
    '''
    df2 = df.copy()
    indicator_macd = MACD(
        close=df2["Close"], window_slow=26, window_fast=12, window_sign=9, fillna=False
    )
    df2['macd'] = indicator_macd.macd()
    df2['macd_signal'] = indicator_macd.macd_signal()
    df2["macd_diff"] = indicator_macd.macd_diff()
    cols = ['macd', 'macd_signal', 'macd_diff']
    df2 = round_series(df2, cols)
    df2 = df2.dropna()
    data_date = df2['Date'].values
    macd = df2['macd'].values
    macd_signal = df2['macd_signal'].values
    df_pos = df2[df2["macd_diff"] >= 0 ].dropna()
    df_neg = df2[df2["macd_diff"] < 0 ].dropna()
    data_date_pos = df_pos['Date'].values
    data_date_neg = df_neg['Date'].values
    data_diff_pos = df_pos['macd_diff'].values
    data_diff_neg = df_neg['macd_diff'].values
    oscillators = [{
        'type':'line',
        'color': 'rgb(0, 148, 255)',
        'name': 'macd',
        'dashStyle': 'solid',
        'data': [[data_date[i], macd[i]] for i in range(len(df2))],
        'yAxis': 2
    },{
        'type':'line',
        'color': 'rgb(255, 106, 0)',
        'name': 'macd_signal',
        'dashStyle': 'solid',
        'data': [[data_date[i], macd_signal[i]] for i in range(len(df2))],
        'yAxis': 2 
    },{
        'type': 'column',
        'color': UP_COLOR,
        'name': 'macd_diff_pos',
        'data':[[data_date_pos[i], data_diff_pos[i]] for i in range(len(df_pos))],
        'yAxis': 2 
    },{
        'type': 'column',
        'color': DOWN_COLOR,
        'name': 'macd_diff_neg',
        'data':[[data_date_neg[i], data_diff_neg[i]] for i in range(len(df_neg))],
        'yAxis': 2 
    }]
    return oscillators

def rsi_plot(df):
    '''rsi_plot
    plot rsi
    Args:
        df(dataframe): the ticker history
    Returns:
        oscillators(list): the plot series for the frontend
    '''
    data_date = df['Date'].values
    df2 = df.copy()
    df2["rsi"] = RSIIndicator(close=df2["Close"], window=14, fillna=False).rsi()
    df2 = round_series(df2, ["rsi"])
    df2 = df2.dropna()
    data_date2 = df2['Date'].values
    rsi = df2['rsi'].values
    oscillators = [{
        'type':'line',
        'color': 'rgb(142, 21, 153)',
        'name': 'rsi',
        'dashStyle': 'solid',
        'data': [[data_date2[i], rsi[i]] for i in range(len(df2))],
        'yAxis': 2
        },{
        'type':'line',
        'color': 'white',
        'name': 'lower band',
        'dashStyle': 'dot',
        'data': [[data_date[i], 30] for i in range(len(df))],
        'enableMouseTracking': False,
        'yAxis': 2
        },{
        'type':'line',
        'color': 'white',
        'name': 'upper bands',
        'dashStyle': 'dot',
        'data': [[data_date[i], 70] for i in range(len(df))],
        'enableMouseTracking': False,
        'yAxis': 2
    }]
    return oscillators

def stoch_plot(df):
    '''stoch_plot
    plot Stochastic Oscillator
    Args:
        df(dataframe): the ticker history
    Returns:
        oscillators(list): the plot series for the frontend
    '''
    df2 = df.copy()
    indicator_so = StochasticOscillator(
        high=df2['High'],
        low=df2['Low'],
        close=df2['Close'],
        window=14,
        smooth_window=3,
        fillna=False,
    )
    df2["stoch"] = indicator_so.stoch()
    df2["stoch_signal"] = indicator_so.stoch_signal()
    df2 = df2.dropna()
    data_date = df2['Date'].values
    stoch = df2["stoch"].values
    stoch_signal = df2["stoch_signal"].values
    cols = ['stoch', 'stoch_signal']
    df2 = round_series(df2, cols)
    oscillators = [{
        'type':'line',
        'color': 'rgb(0, 148, 255)',
        'name': 'stoch',
        'dashStyle': 'solid',
        'data': [[data_date[i], stoch[i]] for i in range(len(df2))],
        'yAxis': 2
    },{
        'type':'line',
        'color': 'rgb(255, 106, 0)',
        'name': 'stoch_signal',
        'dashStyle': 'solid',
        'data': [[data_date[i], stoch_signal[i]] for i in range(len(df2))],
        'yAxis': 2 
    }]
    return oscillators

if __name__ == "__main__":
    import yfinance as yf

    ticker = 'AAPL'
    interval = '1d'
    data = yf.download(
            tickers=ticker,
            period='2y',
            interval=interval,
            group_by='ticker',
            auto_adjust=True,
            prepost=False,
            threads=True,
    )
    df = data.reset_index().dropna()
    df['Date'] = df['Date'].apply(lambda x: x.timestamp()*1000).astype(int)
    plots = get_indicator(df, {'overlay': 'ema', 'oscillator': 'macd'})
    print(plots)
    
