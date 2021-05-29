export const setTicker = (ticker) =>{
    return {
        type: 'SET_TICKER',
        payload: ticker
    }
}
export const setWatchlist = (watchlist) => {
    return {
        type: 'SET_WATCHLIST',
        payload: watchlist
    }
}