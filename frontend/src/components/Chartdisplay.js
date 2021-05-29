import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {setTicker, setWatchlist} from '../redux/action';
import {MenuItem, FormControl, Select} from '@material-ui/core/';
import './Chartdisplay.css'
import axios from 'axios'
import Highcharts from 'highcharts/highstock';
window.Highcharts = Highcharts;
import StockChart from './StockChart'
import Technicalfunc from './Technicalfunc'
import {BACKGROUND_COLOR ,DEFAULT_COLOR, UP_COLOR, DOWN_COLOR} from './util'


function Chartdisplay() {
    const [inputText, setInputText] = useState('')
    const [interval, setInterval] = useState('1d');
    const [period, setPeriod] = useState('ytd')
    const [charttype, setCharttype] = useState('candlestick');
    const [indicators, setIndicators] = useState({overlay:"", oscillator: ""});
    const dispatch = useDispatch();
    const ticker = useSelector(state => state.ticker);
    const [data, setData] = useState({});
    const [stockOptions, setStockOptions] = useState({});
    const [height, setHeight] = useState(0)

    useEffect(() => {
        // load from local storage
        if (localStorage.getItem("indicators") !== null){
            setIndicators(JSON.parse(localStorage.getItem("indicators")))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("indicators", JSON.stringify(indicators))
    }, [indicators])
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        if (!localStorage.getItem("tickers").includes(inputText)){
            axios.get(`/api/info/${inputText}`)
                .then(res=>{
                    let localTicker = JSON.parse(localStorage.getItem("tickers"));
                    localTicker = [inputText, ...localTicker];
                    dispatch(setTicker(inputText));
                    dispatch(setWatchlist(localTicker))
                })
                .catch(err=>{
                    alert("Stock Input Error")
                    console.log(err)
                })
        }else{
            dispatch(setTicker(inputText));
        }
        setInputText('')
    }

    useEffect(() => {
        if(ticker !==''){
            axios.post(`api/quote/q=${ticker}&t=${interval}&p=${period}`, {indicators: indicators})
                .then(res => {
                    setData(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [ticker, interval, period, indicators])

    useEffect(()=>{
        setHeight(window.innerHeight* 0.60)
    }, [])

    useEffect(() => {
        if(Object.keys(data).length !== 0){
            let yAxis
            if(indicators.oscillator === ""){
                yAxis = [{
                    height: '85%',
                    labels: {style:{color: DEFAULT_COLOR}, align: 'right',x: -3},
                    }, {
                    top: '85%',
                    height: '15%',
                    labels: {align: 'right', style: {color: DEFAULT_COLOR},x: -3},
                    offset: 0,
                }]
            }else{
                yAxis = [{
                    height: '70%',
                    labels: {style:{color: DEFAULT_COLOR}, align: 'right',x: -3},
                    }, {
                    top: '70%',
                    height: '5%',
                    labels: {align: 'right', style: {color: DEFAULT_COLOR},x: -3},
                    offset: 0,
                    }, {
                    top: '75%',
                    height: '25%',
                    labels: {align: 'right', style: {color: DEFAULT_COLOR},x: -3},
                    offset: 0,
                }]
            }
            setStockOptions({
                yAxis: yAxis,
                xAxis:[{labels: {style:{color: DEFAULT_COLOR}}}],
                series:[{
                    data: data.data,
                    type: charttype,
                    name: `${ticker} Stock Price`,
                    id: 'main-series',
                },{
                    type: 'column',
                    name: 'Volume',
                    data: data.volume,
                    color: 'white',
                    yAxis: 1,
                }, ...data.indicators],
                rangeSelector: {
                    buttons:[],
                },
                plotOptions:{
                    candlestick:{
                        color: DOWN_COLOR,
                        lineColor: DOWN_COLOR,
                        upColor: UP_COLOR,
                        upLineColor: UP_COLOR,
                    },
                    ohlc:{
                        color: DOWN_COLOR,
                        lineColor: DOWN_COLOR,
                        upColor: UP_COLOR,
                        upLineColor: UP_COLOR,
                    },
                    line:{
                        color: UP_COLOR,
                        lineWidth: 1
                    }
                },
                chart:{
                    height: `${height}px`,
                    backgroundColor: BACKGROUND_COLOR,
                }
            })
        }
    }, [data, charttype])

    return (
        <div className="Chartdisplay">
            <div className="Chartdisplay__menu">
                {/* ticker input */}
                <div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                value={inputText}
                                className="Tickerinput"
                                placeholder={ticker}
                                type="text"
                                onChange={(e) => setInputText(e.target.value.toUpperCase())}
                            />
                        </div>
                        <button type="submit" style={{ display: 'none' }}>Submit</button>
                    </form>
                </div>
                {/* Interval */}
                <div>
                    <FormControl>
                        <Select
                        className="Menu__dropdown"
                        value={interval}
                        onChange={(e) => setInterval(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        >
                        <MenuItem value="1d">D</MenuItem>
                        <MenuItem value="5d">W</MenuItem>
                        <MenuItem value="1mo">1M</MenuItem>
                        <MenuItem value="3mo">3M</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {/* Period */}
                <div>
                    <FormControl>
                        <Select
                        className="Menu__dropdown"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        >
                        <MenuItem value="ytd">YTD</MenuItem>
                        <MenuItem value="1y">1Y</MenuItem>
                        <MenuItem value="2y">2Y</MenuItem>
                        <MenuItem value="5y">5Y</MenuItem>
                        <MenuItem value="10y">10Y</MenuItem>
                        <MenuItem value="max">MAX</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {/* Chart type */}
                <div>
                    <FormControl>
                        <Select
                        className="Menu__dropdown"
                        value={charttype}
                        onChange={(e) => setCharttype(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        >
                        <MenuItem value="candlestick">Candlestick</MenuItem>
                        <MenuItem value="ohlc">OHLC</MenuItem>
                        <MenuItem value="line">Line</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {/* Technical Indicator */}
                <Technicalfunc indicators={indicators} setIndicators={setIndicators}/>
            </div>
            <div className="Chartdisplay__chart" id="chart">
                <StockChart options={stockOptions} highcharts={Highcharts} />
            </div>
        </div>
    )
}

export default Chartdisplay
