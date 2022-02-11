import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chartdisplay from './components/Chartdisplay';
import Infoscreener from './components/Infoscreener';
import Market from './components/Market';
import Fundament from './components/Fundament';
import './App.css';
import axios from 'axios';

function App() {
    const [fundamentData, setFundamentData] = useState({});
    const [newsData, setNewsData] = useState([]);
    const ticker = useSelector(state => state.ticker);

    useEffect(() => {
        if (ticker !== '') {
            axios
                .get(`/api/info/${ticker}`)
                .then(res => {
                    setFundamentData(res.data.fundament);
                    setNewsData(res.data.news);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [ticker]);

    return (
        <div className="App">
            <div className="App__leftPanel">
                <Chartdisplay />
                <Infoscreener
                    newsData={newsData}
                    fundamentData={fundamentData}
                />
            </div>
            <div className="App__rightPanel">
                <Market />
                <Fundament fundamentData={fundamentData} />
            </div>
        </div>
    );
}

export default App;
