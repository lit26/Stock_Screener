import React, {useState, useEffect} from 'react'
import './Newsscreener.css'

function Parsedate({datetime}){
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        let date_time = datetime.split('T');
        setDate(date_time[0])
        setTime(date_time[1])
    }, [datetime])

    return (
        <div>
            <div>{date}</div>
            <div>{time}</div>
        </div>
    )
}

function Newsscreener({newsData}) {
    return (
        <div className="Newsscreener">
            <table>
            {newsData.map((news, index)=>{
                return (
                    <tr className="Newsscreener__row" key={`news_${index}`}>
                        <td>{index+1}</td>
                        <td className="Newsscreener__date"><Parsedate datetime={news.Date}/></td>
                        <td><a href={news.Link}>{news.Title}</a></td>
                    </tr>
                )
            })}
            </table>
        </div>
    )
}

export default Newsscreener
