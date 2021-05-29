import React from 'react'
import './Statscreener.css'
import Datacell from './Datacell'

const COLUMNS=[
    ['Index', 'Income', 'Sales', 'Book/sh','Cash/sh', 'Dividend', 'Dividend %', 'Employees', 'Optionable', 'Shortable', 'Recom'],
    ['P/E', 'Forward P/E', 'PEG', 'P/S', 'P/B', 'P/C', 'P/FCF', 'Quick Ratio', 'Current Ratio', 'Debt/Eq', 'LT Debt/Eq'],
    ['EPS (ttm)', 'EPS next Y', 'EPS next Q', 'EPS this Y', 'EPS next Y', 'EPS next 5Y', 'EPS past 5Y', 'Sales past 5Y', 'Sales Q/Q', 'EPS Q/Q', 'Earnings'],
    ['Insider Own', 'Insider Trans', 'Inst Own', 'Inst Trans', 'ROA', 'ROE', 'ROI', 'Gross Margin', 'Oper. Margin', 'Profit Margin', 'Payout'],
    ['Short Float', 'Short Ratio', 'Target Price', '52W Range From', '52W Range To', '52W High', '52W Low', 'Beta', 'ATR', 'Volatility M', 'Volatility W']
]

function Statscreener({fundamentData}) {
    return (
        <div className="Statcolumn">
            {/* Column 1 */}
            {COLUMNS.map((column, index)=>{
                return (
                    <div className={`Statcolumn__${index}`}key={`Column_${index}`}>
                        <table>
                            {
                                column.map((label, index2)=>{
                                    return (
                                        <tr key={`Cell_${index}${index2}`}>
                                            <td><div className="Statcolumn__label">{label}</div></td>
                                            <td>
                                                <div className="Statcolumn__data">
                                                    <Datacell label={label} data={fundamentData[label]}/>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </table>
                    </div>
                )
            })}
        </div>
    )
}

export default Statscreener
