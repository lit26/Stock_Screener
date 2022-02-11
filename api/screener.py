import pandas as pd
from finvizfinance.util import web_scrap, number_covert, NUMBER_COL, util_dict

BASE_URL = 'https://finviz.com/screener.ashx?v={screener}{filter}&ft=4&o={order}&r={row}'
FILTER_DICT = util_dict['filter']

def set_filters(filters_dict):
    """Set filters.
    Args:
        filters_dict(dict): dictionary of filters
    Returns:
        url_filter(str): filter string for url
    """
    filters = []
    for key, value in filters_dict.items():
        if key not in FILTER_DICT:
            filter_keys = list(FILTER_DICT.keys())
            raise ValueError("Invalid filter '{}'. Possible filter: {}".format(key, filter_keys))
        if value not in FILTER_DICT[key]['option']:
            filter_options = list(FILTER_DICT[key]['option'].keys())
            raise ValueError("Invalid filter option '{}'. Possible filter options: {}".format(value,
                                                                                              filter_options))
        prefix = FILTER_DICT[key]['prefix']
        urlcode = FILTER_DICT[key]['option'][value]
        if urlcode != '':
            filters.append('{}_{}'.format(prefix, urlcode))
    url_filter = ''
    if len(filters) != 0:
        url_filter = '&f=' + ','.join(filters)
    return url_filter

def screener_helper(rows, num_col_index, table_header):
    """Get screener table helper function.
    Returns:
        df(pandas.DataFrame): screener information table
    """
    rows = rows[1:]
    df = pd.DataFrame([], columns=table_header)
    for index, row in enumerate(rows):
        cols = row.findAll('td')[1:]
        info_dict = {}
        for i, col in enumerate(cols):
            # check if the col is number
            if i not in num_col_index:
                info_dict[table_header[i]] = col.text
            else:
                info_dict[table_header[i]] = number_covert(col.text)
        df = df.append(info_dict, ignore_index=True)
    return df


def get_screener(screener, filters=None, order='ticker', page=1, ascend=True):
    '''get_screener
    Get screener from finviz website
    Args:
        screener(str): screener type
        filters(list): filters
        order(str): order of the dataframe.
        page(int): page number
    '''
    if screener == 'overview':
        screener_code = '111'
    elif screener == 'financial':
        screener_code = '161'
    elif screener == 'ownership':
        screener_code = '131'
    elif screener == 'performance':
        screener_code = '141'
    elif screener == 'technical':
        screener_code = '171'
    elif screener == 'valuation':
        screener_code = '121'
    
    # get url
    url_filter = ''
    if filters:
        url_filter = set_filters(filters)
    url_order = order
    if not ascend:
        url_order = '-' + order 
    url_row = (page - 1) * 20 + 1
    url = BASE_URL.format(screener=screener_code, filter=url_filter, order=url_order, row=url_row)
    
    # scrap website
    soup = web_scrap(url)
    page = len(soup.findAll('table')[17].findAll('option'))
    if page == 0:
        print('No information found.')
        return None, 0
    table = soup.findAll('table')[18]
    rows = table.findAll('tr')
    table_header = [i.text for i in rows[0].findAll('td')][1:]
    num_col_index = [table_header.index(i) for i in table_header if i in NUMBER_COL]
    df = screener_helper(rows, num_col_index, table_header)
    return df, page

if __name__ == '__main__':
    filters_dict = {'Exchange':'AMEX','Sector':'Basic Materials'}
    df, page = get_screener('Overview', filters=filters_dict, order='company', page=3, ascend=False)
    print(df)
    print(page)
