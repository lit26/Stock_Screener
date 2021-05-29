import React, {useState, useEffect} from 'react'
import Finvizscreener from './Finvizscreener'
import Statscreener from './Statscreener'
import Newsscreener from './Newsscreener'
import Statementscreener from './Statementscreener'
import Portfolioscreener from './Portfolioscreener'
import './Infoscreener.css'

function Infoscreener({newsData, fundamentData}) {
    const [menu, setMenu] = useState('screener');
    const [screener, setScreener] = useState([]);

    useEffect(() => {
        if (menu === 'screener'){
            setScreener(<Finvizscreener />);
        }else if (menu === 'stat'){
            setScreener(<Statscreener fundamentData={fundamentData}/>);
        }else if (menu === 'news'){
            setScreener(<Newsscreener newsData={newsData}/>);
        }else if (menu === 'statement'){
            setScreener(<Statementscreener/>);
        }else if (menu === 'portfolio'){
            setScreener(<Portfolioscreener/>);
        }else{
            setScreener([])
        }
    }, [menu, newsData])

    return (
        <div className="Infoscreener">
            <div className="Infoscreener__menu">
                <div onClick={() => setMenu('screener')}>Screener</div>
                <div onClick={() => setMenu('stat')}>Stat</div>
                <div onClick={() => setMenu('news')}>News</div>
                <div onClick={() => setMenu('statement')}>Statement</div>
                <div onClick={() => setMenu('portfolio')}>Portfolio</div>
            </div>
            <div className="Infoscreener__screener">
                {screener}
            </div>
        </div>
    )
}

export default Infoscreener
