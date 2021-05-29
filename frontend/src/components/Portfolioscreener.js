import React, {useState, useEffect} from 'react'
import './Portfolioscreener.css'
import axios from 'axios'
import {Edit, Delete} from '@material-ui/icons';
import Portfoliomodal from './Portfoliomodal'

function Portfolioscreener() {
    const [portfolio, setPortfolio] = useState([]);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({
        id: '',
        stock: '',
        cost: '',
        shares: ''
    })
    const [error, setError] = useState({
        stock: false,
        cost: false,
        shares: false
    })
    const [stat, setStat] = useState({
        equity: 0,
        return: 0,
        pct: 0
    })

    const handleOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        axios.get(`/api/portfolio/`)
            .then(res => {
                setPortfolio(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        let equity = 0;
        let returns = 0;
        for(let i=0; i<portfolio.length; i++){
            equity = equity + portfolio[i].equity
            returns = returns + portfolio[i].return
        }

        setStat({
            equity: equity,
            return: returns,
            pct: returns*100/(equity-returns)
        })
    }, [portfolio])

    const addHandler = (e)=>{
        e.preventDefault();
        // validate
        let errors = {stock: false, cost: false, shares: false}
        if (data.stock === ''){
            errors.stock = true
        }
        if (typeof parseFloat(data.cost) !== 'number' || isNaN(parseFloat(data.cost))){
            errors.cost = true
        }
        if (typeof parseFloat(data.shares) !== 'number' || isNaN(parseFloat(data.shares))){
            errors.shares = true
        }
        if (errors.stock === false && errors.cost === false && errors.shares === false){
            let requestData = {
                ticker: data.stock,
                cost: parseFloat(data.cost),
                shares: parseFloat(data.shares)
            }
            if(data.id === ""){
                axios.post('/api/portfolio/', requestData)
                    .then(res => {
                        setPortfolio(res.data)
                        setOpen(false);
                        setData({
                            id: '',
                            stock: '',
                            cost: '',
                            shares: ''
                        })
                    })
                    .catch(err => {
                        alert('Try again')
                        console.log(err)
                    })
            }else{
                axios.put(`/api/portfolio/${data.id}`, requestData)
                    .then(res => {
                        console.log(res.data)
                        setPortfolio(res.data)
                        setOpen(false);
                        setData({
                            id: '',
                            stock: '',
                            cost: '',
                            shares: ''
                        })
                    })
                    .catch(err => {
                        alert('Try again')
                        console.log(err)
                    })
            }

        }else{
            setError(errors)
        }
    }

    const editHandler = (id, ticker, cost, shares) =>{
        setData({
            id: id,
            stock: ticker,
            cost: cost,
            shares: shares
        })
        setOpen(true);
    }

    const deleteHandler = (id) =>{
        axios.delete(`/api/portfolio/${id}`)
            .then(res => {
                setPortfolio(portfolio.filter((item) => item.id !== id))
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="Portfolioscreener">
            <div className="Portfolioscreener__action">
                <div onClick={handleOpen}>
                    Add
                </div>
                <Portfoliomodal 
                    addHandler={addHandler} 
                    data={data} setData={setData} 
                    error={error}
                    open={open} setOpen={setOpen}/>
            </div>
            <div className="Portfolioscreener__screener">
                <table>
                    <tbody>
                    <tr>
                        <th className="Portfolioscreener__index">#</th>
                        <th>Symbol</th>
                        <th>Cost</th>
                        <th>Shares</th>
                        <th>Price</th>
                        <th>Equity</th>
                        <th>Return</th>
                        <th>Pct</th>
                        <th></th>
                    </tr>
                    {
                        portfolio.map((holding, index)=>{
                            return (
                                <tr key={`portfolio_${holding.id}`}>
                                    <td className="Portfolioscreener__index">{index+1}</td>
                                    <td>{holding.ticker}</td>
                                    <td>${holding.cost.toFixed(2)}</td>
                                    <td>{holding.shares.toFixed(2)}</td>
                                    <td>${holding.price.toFixed(2)}</td>
                                    <td>${holding.equity.toFixed(2)}</td>
                                    <td>
                                        <span className={holding.return > 0 ? "Value__up" : "Value__down"}>
                                            ${holding.return.toFixed(2)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={holding.return > 0 ? "Value__up" : "Value__down"}>
                                            {holding.pct.toFixed(2)}%
                                        </span>
                                    </td>
                                    <td>
                                        <div className="Portfolioscreener__action">
                                            <Edit onClick={() => editHandler(holding.id, holding.ticker, holding.cost, holding.shares)}/>
                                            <Delete onClick={() => deleteHandler(holding.id)}/>
                                        </div>        
                                    </td>
                                </tr>
                            )
                        })
                    }
                    <tr>
                        <td className="Portfolioscreener__index"></td>
                        <td>Total</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>${stat.equity.toFixed(2)}</td>
                        <td><span className={stat.return > 0 ? "Value__up" : "Value__down"}>${stat.return.toFixed(2)}</span></td>
                        <td><span className={stat.return > 0 ? "Value__up" : "Value__down"}>{stat.pct.toFixed(2)}%</span></td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Portfolioscreener
