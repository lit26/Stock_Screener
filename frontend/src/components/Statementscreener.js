import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import {MenuItem, FormControl, Select} from '@material-ui/core';
import './Statementscreener.css'
import axios from 'axios'

function StatementTable({statementData}) {
    return (
        <table>
            <tr>
                <th></th>
                {statementData['data']['Period End Date'].map((data, index)=>{
                    return <th key={`Statementheader_${index}`}>{data}</th>
                })}
            </tr>
            {statementData['header'].map((row, index)=>{
                return (
                    <tr key={`Statementrow__${index}`}>
                        <td><div className="Statement__rowheader">{row}</div></td>
                        {statementData['data'][row].map((data, index)=>{
                            return (
                                <td key={`Statement${row}_${index}`}>
                                    <div className="Statement__rowData">{data}</div>
                                </td>)
                        })}
                    </tr>
                )
            })}
        </table>
    )
}

function Statementscreener() {
    const [statement, setStatement] = useState("I");
    const [timeframe, setTimeframe] = useState("A");
    const [statementData, setStatementData] = useState({});
    const [screener, setScreener] = useState([])
    const ticker = useSelector(state => state.ticker);

    useEffect(() => {
        if(ticker !== ""){
            axios.get(`/api/statement/${ticker}/${statement}/${timeframe}`)
                .then(res => {
                    setStatementData(res.data);
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [ticker, statement, timeframe])

    useEffect(() => {
        if(Object.keys(statementData).length === 0){
            setScreener(<h3>No Available Data.</h3>)
        }else{
            setScreener(
                <StatementTable statementData={statementData} statement={statement}/>
            )
        }
    }, [statementData])

    return (
        <div className="Statementscreener">
            {/* Secondary Menu */}
            <div className="Statementscreener__menu">
                <div>
                    <FormControl>
                        <Select
                            value={statement}
                            onChange={(e) => setStatement(e.target.value)}
                            displayEmpty
                            >
                            <MenuItem value="I">Income Statement</MenuItem>
                            <MenuItem value="B">Balance Sheet</MenuItem>
                            <MenuItem value="C">Cash Flow</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl>
                        <Select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            displayEmpty
                            >
                            <MenuItem value="A">Annual</MenuItem>
                            <MenuItem value="Q">Quarterly</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            {/* Screener */}
            <div className="Statementscreener__screener">
                 {screener}
            </div>
        </div>
    )
}

export default Statementscreener
