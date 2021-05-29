import React, {useState, useEffect} from 'react'
import {DEFAULT_COLOR, UP_COLOR, DOWN_COLOR} from './util'

const PCT_COLUMNS = ['Dividend %', 'EPS this Y', 'EPS next Y', 'EPS next 5Y', 'EPS past 5Y', 'Sales past 5Y', 'Sales Q/Q', 'EPS Q/Q',
    'Insider Own', 'Insider Trans', 'Inst Own', 'Inst Trans', 'ROA', 'ROE', 'ROI', 'Gross Margin', 'Oper. Margin', 'Profit Margin', 
    'Payout', 'Short Float', '52W High', '52W Low', 'Volatility M', 'Volatility W']

const COLOR_COLUMNS = ['P/B',  'Sales Q/Q', 'EPS Q/Q', 'ROA', 'ROE', 'ROI', 'Oper. Margin', 
                    'Profit Margin','Target Price', '52W High', '52W Low']
const COLOR_COLUMNS_REV = ['Debt/Eq', 'LT Debt/Eq']

function Datacell({label, data}) {
    const [color, setColor] = useState(DEFAULT_COLOR);
    const [num, setNum] = useState('')

    useEffect(() => {
        if (COLOR_COLUMNS.includes(label)){
            if(data<0){
                setColor(DOWN_COLOR)
            }else{
                setColor(UP_COLOR)
            }
        }else if (COLOR_COLUMNS_REV.includes(label)){
            if(data<0){
                setColor(UP_COLOR)
            }else{
                setColor(DOWN_COLOR)
            }
        }

        if(typeof data === 'string'){
            setNum(data)
        }else if (typeof data === 'boolean'){
            if(data === true){
                setNum('Yes')
            }else{
                setNum('No')
            }
        }else if (PCT_COLUMNS.includes(label)){
            setNum(`${(data*100).toFixed(2)}%`)
        }else if (typeof data === 'number'){
            let number;
            if(data > 1000000000){
                number = data/1000000000
                setNum(`${number.toFixed(2)}B`)
            }else if (data > 1000000){
                number = data/1000000
                setNum(`${number.toFixed(2)}M`)
            }else if (data > 1000){
                number = data/1000
                setNum(`${number.toFixed(2)}K`)
            }else{
                number = data
                setNum(`${number.toFixed(2)}`)
            }
        }

    }, [data])

    return (
        <span style={{color:color}}>{num}</span>
    )
}

export default Datacell
