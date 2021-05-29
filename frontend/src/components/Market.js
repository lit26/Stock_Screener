import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTicker, setWatchlist } from '../redux/action'
import axios from 'axios'
import SortableTicker from './SortableTicker'
import './Market.css'

const DEFAULT_TICKER = ['SPY', 'AAPL', 'TSLA']

function Market() {
    const [sortableTicker, setSortableTicker] = useState(null);
    const [resData, setResData] = useState([]);
    const dispatch = useDispatch();
    const watchlist = useSelector(state => state.watchlist);

    useEffect(() => {
        // load from local storage
        let tickers;
        if (localStorage.getItem("tickers") === null){
            localStorage.setItem("tickers", JSON.stringify(DEFAULT_TICKER))
            dispatch(setWatchlist(DEFAULT_TICKER));
            dispatch(setTicker("SPY"))
        }else{
            tickers = JSON.parse(localStorage.getItem("tickers"))
            dispatch(setWatchlist(tickers))
            dispatch(setTicker(tickers[0]))
        }
    }, [])

    useEffect(() => {
        if(watchlist.length > 0){
            let request = {"tickers": watchlist}
            axios.post('/api/market/', request)
                .then(res => {
                    setResData(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [watchlist])

    useEffect(() => {
        let filterData = resData.filter(ticker => watchlist.includes(ticker.ticker))
        setResData(filterData)
    }, [watchlist])

    useEffect(() => {
        if(watchlist.length > 0){
            setSortableTicker(<SortableTicker tickers={watchlist} data={resData}/>)
        }
    }, [resData])

    return (
        <div className="Market">
            <div>
                <h4>Watchlist</h4>
                <hr />
            </div>
            <div className="Market__table">
                <table>
                    <thead className="Market__header">
                        <tr>
                            <th>Symbol</th>
                            <th>Price</th>
                            <th>Chg</th>
                            <th>Pct</th>
                            <td></td>
                            <td></td>
                        </tr>
                    </thead>
                    {sortableTicker} 
                </table>
            </div>
            
        </div>
    )
}

export default Market
