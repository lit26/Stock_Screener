import { combineReducers } from 'redux' 

const tickerReducer = (state = '', action) =>{
    switch (action.type){
        case 'SET_TICKER':
            return action.payload;
        default:
            return state;
    }
        
}

const watchlistReducer = (state=[], action) =>{
    switch (action.type){
        case 'SET_WATCHLIST':
            return action.payload;
        default:
            return state
    }
}

const allReducers = combineReducers({
    ticker: tickerReducer,
    watchlist: watchlistReducer
})

export default allReducers;