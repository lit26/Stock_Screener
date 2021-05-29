import React, { Component } from 'react';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Marketrow from './Marketrow'

const SortableItem = sortableElement(({ value }) => {
    return (
        <Marketrow
            ticker={value.ticker}
            price={value.current}
            chg={value.chg}
            pct={value.pct}
        />
    )
});

const SortableContainer = sortableContainer(({ children }) => {
    return <tbody className="Market__main">{children}</tbody>;
});

class SortableTicker extends Component {
    state = {
        tickers: [],
        data: []
    };

    componentDidMount() {
        this.setState({
            tickers: this.props.tickers,
            data: this.props.data
        });
    }
    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            this.setState({
                tickers: this.props.tickers,
                data: this.props.data
            });
        }
        
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState(({ tickers }) => ({
            tickers: arrayMove(tickers, oldIndex, newIndex),
        }));
    };

    render() {
        const { tickers, data } = this.state;
        localStorage.setItem("tickers", JSON.stringify(tickers));
        data.sort((a,b) => tickers.indexOf(a.ticker) - tickers.indexOf(b.ticker));
        return (
            <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
                {data.map((value, index) => (
                    <SortableItem key={`item-${value.ticker}`} index={index} value={value} />
                ))}
            </SortableContainer>
        );
    }
}

export default SortableTicker