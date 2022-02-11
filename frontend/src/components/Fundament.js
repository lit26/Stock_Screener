import React, { useState, useEffect } from 'react';
import './Fundament.css';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

function NumberFormat({ n, type }) {
    const [num, setNum] = useState('-');

    useEffect(() => {
        if (type === 'pct') {
            setNum(`${(n * 100).toFixed(2)}%`);
        }
    }, [n]);

    return <span className={n > 0 ? `Value__up` : `Value__down`}>{num}</span>;
}

function PerfDiv({ n, timeframe, ta_type }) {
    const [num, setNum] = useState('');

    useEffect(() => {
        if (ta_type === 'n') {
            setNum(`${n}`);
        } else {
            setNum(`${(n * 100).toFixed(2)}%`);
        }
    }, [n]);

    return (
        <div
            className={`PerfDiv ${
                n > 0 ? `Valuebackground__up` : `Valuebackground__down`
            }`}>
            <div>{num}</div>
            <div>{timeframe}</div>
        </div>
    );
}

function StatDiv({ label, n }) {
    const [num, setNum] = useState('-');

    useEffect(() => {
        if (n !== undefined && n !== null) {
            let number;
            if (n > 1000000000) {
                number = n / 1000000000;
                setNum(`${number.toFixed(2)}B`);
            } else if (n > 1000000) {
                number = n / 1000000;
                setNum(`${number.toFixed(2)}M`);
            } else if (n > 1000) {
                number = n / 1000;
                setNum(`${number.toFixed(2)}K`);
            } else {
                number = n;
                setNum(`${number.toFixed(2)}`);
            }
        } else {
            setNum('-');
        }
    }, [n]);

    return (
        <div className="StatDiv">
            <div>{label}</div>
            <div>{num}</div>
        </div>
    );
}

function Fundament({ fundamentData }) {
    return (
        <>
            {Object.keys(fundamentData).length !== 0 && (
                <div className="Fundament">
                    <div className="Fundgeneral">
                        <h4>{fundamentData['Company']}</h4>
                        {/* Title */}
                        <div>
                            {fundamentData['Industry']}
                            <FiberManualRecordIcon className="separatedot" />
                            {fundamentData['Sector']}
                            <FiberManualRecordIcon className="separatedot" />
                            {fundamentData['Country']}
                        </div>
                        {/* Price */}
                        <div>
                            <h1>
                                {fundamentData.Price}
                                <span className="chg">
                                    <NumberFormat
                                        n={fundamentData['Change']}
                                        type="pct"
                                    />
                                </span>
                            </h1>
                            <span className="Fund__text">
                                Prev Close:{' '}
                                {fundamentData['Prev Close'].toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <div className="Fundstat">
                        <div>
                            <h3>Key Stat</h3>
                            <div className="Fund__text">
                                <StatDiv
                                    label="Market Cap"
                                    n={fundamentData['Market Cap']}
                                />
                                <StatDiv label="P/E" n={fundamentData['P/E']} />
                                <StatDiv
                                    label="EPS(ttm)"
                                    n={fundamentData['EPS (ttm)']}
                                />
                                <StatDiv
                                    label="Volume"
                                    n={fundamentData['Volume']}
                                />
                                <StatDiv
                                    label="Avg Volume"
                                    n={fundamentData['Avg Volume']}
                                />
                                <StatDiv
                                    label="Shs OutStand"
                                    n={fundamentData['Shs Outstand']}
                                />
                                <StatDiv
                                    label="Shs Float"
                                    n={fundamentData['Shs Float']}
                                />
                            </div>
                        </div>
                        {/* Performance */}
                        <div>
                            <h3>Performance</h3>
                            <div className="Fund__row">
                                <PerfDiv
                                    n={fundamentData['Perf Week']}
                                    timeframe="W"
                                />
                                <PerfDiv
                                    n={fundamentData['Perf Month']}
                                    timeframe="M"
                                />
                                <PerfDiv
                                    n={fundamentData['Perf Quarter']}
                                    timeframe="Q"
                                />
                            </div>
                            <div className="Fund__row">
                                <PerfDiv
                                    n={fundamentData['Perf Half Y']}
                                    timeframe="HY"
                                />
                                <PerfDiv
                                    n={fundamentData['Perf Year']}
                                    timeframe="Y"
                                />
                                <PerfDiv
                                    n={fundamentData['Perf YTD']}
                                    timeframe="YTD"
                                />
                            </div>
                        </div>
                        {/* Performance */}
                        <div>
                            <h3>Technical</h3>
                            <div className="Fund__row">
                                <PerfDiv
                                    n={fundamentData['SMA20']}
                                    timeframe="SMA20"
                                />
                                <PerfDiv
                                    n={fundamentData['SMA50']}
                                    timeframe="SMA50"
                                />
                            </div>
                            <div className="Fund__row">
                                <PerfDiv
                                    n={fundamentData['SMA20']}
                                    timeframe="SMA200"
                                />
                                <PerfDiv
                                    n={fundamentData['RSI (14)']}
                                    timeframe="RSI(14)"
                                    ta_type="n"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Fundament;
