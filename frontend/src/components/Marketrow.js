import React from 'react'
import { useDispatch } from 'react-redux'
import { setTicker, setWatchlist } from '../redux/action'
import {sortableHandle} from 'react-sortable-hoc';
import {Menu, Close} from '@material-ui/icons';

const DragHandle = sortableHandle(() => <span><Menu /></span>);

function Marketrow({ticker, price, chg, pct}) {
    const dispatch = useDispatch();

    const delHandler = (delTicker) => {
        let tickers = JSON.parse(localStorage.getItem("tickers"));
        if(tickers.length > 1){
            let remainTickers = tickers.filter(ticker => ticker !== delTicker);
            localStorage.setItem("tickers", JSON.stringify(remainTickers));
            dispatch(setWatchlist(remainTickers));
            dispatch(setTicker(remainTickers[0]));
        }else{
            alert('Watchlist needs at least one stock.')
        }
    }

    return (
        <tr className="MarketRow"onClick={() => dispatch(setTicker(ticker))}>
            <td>{ticker}</td>
            <td>${price.toFixed(2)}</td>
            <td className={chg > 0 ? "Value__up" : "Value__down"}>{chg.toFixed(2)}</td>
            <td className={chg > 0 ? "Value__up" : "Value__down"}>{pct.toFixed(2)}%</td>
            <td><DragHandle /></td>
            <td><Close onClick={()=>delHandler(ticker)}/></td>
        </tr>
    )
}

export default Marketrow