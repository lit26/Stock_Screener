import React, {useState, useEffect} from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {InputLabel, MenuItem, FormControl, Select, Modal, Backdrop, Fade, Button} from '@material-ui/core/';
import axios from 'axios'
import './Finvizscreener.css'
import {INITIAL_SETTINGS, FILTTER_OPTIONS} from './FilterSetting'
import Screenertable from './Screenertable'
import {Settings, ArrowBack, ArrowForward} from '@material-ui/icons';

const useStyles = makeStyles((theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: '#222838',
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    root: {
      '& > *': {
        margin: theme.spacing(2),
      },
      display: 'flex',
      justifyContent: 'center'
    },
  }),
);

function Finvizscreener() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [screener, setScreener] = useState('overview');
    const [order, setOrder] = useState('Ticker');
    const [page, setPage] = useState(1);
    const [ascend, setAscend] = useState(true)
    const [filterSetting, setFilterSetting] = useState(INITIAL_SETTINGS);
    const [screenerData, setScreenerData] = useState([]);

    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e, filter) =>{
        let newValues = {...filterSetting};
        newValues[filter] = e.target.value
        setFilterSetting(newValues)
    }
    const handleSave = () =>{
        sendRequest()
        setOpen(false);
    }

    useEffect(() => {
        setPage(1)
        sendRequest();
    }, [screener, order, ascend])

    useEffect(() => {
        sendRequest();
    }, [page])

    const sendRequest = () =>{
        let postFilter = Object.fromEntries(
            Object.entries(filterSetting).filter(([key, value]) => value !== ""))
        let postData = {
            filter: postFilter,
            order: order,
            page: page,
            ascend: ascend,
        }
        axios.post(`/api/screener/${screener}`, postData)
            .then(res => {
                setScreenerData(res.data)
            })
            .catch(err => {
                setScreenerData([])
                console.log(err)
            })
    }

    const pageBackward = () =>{
        if(page > 1){
            setPage(page - 1)
        }
    }

    const pageForward = () =>{
        if (page < screenerData.page){
             setPage(page + 1)
        }
    }

    const orderClick = (header) =>{
        if (header === order){
            setAscend(!ascend)
        }else{
            setOrder(header)
        }
    }

    return (
        <div className="Finvizscreener">
            {/* Secondary Menu */}
            <div className="Finvizscreener__menu">
                <div className="Finvizscreener__setting">
                    <div>
                        <FormControl>
                            <Select
                                value={screener}
                                onChange={(e) => setScreener(e.target.value)}
                                displayEmpty
                                >
                                <MenuItem value="overview">Overview</MenuItem>
                                <MenuItem value="valuation">Valuation</MenuItem>
                                <MenuItem value="financial">Financial</MenuItem>
                                <MenuItem value="ownership">Ownership</MenuItem>
                                <MenuItem value="performance">Performance</MenuItem>
                                <MenuItem value="technical">Technical</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="FilterSetting" onClick={handleOpen}>
                        <Settings />
                    </div>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                        timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                            <div className={`${classes.paper}`}>
                                <h3>Filters Setting</h3>
                                <div className={`Screener__filter`}>
                                    {Object.entries(FILTTER_OPTIONS).map(([key, value])=>{
                                        return (
                                            <div key={`filter_${key}`} className="FilterSelect">
                                                <FormControl>
                                                    <InputLabel>{key}</InputLabel>
                                                    <Select
                                                        value={filterSetting[key]}
                                                        onChange={e => handleChange(e, key)}
                                                        >
                                                        {Object.entries(value).map(([key2, value2])=>{
                                                            return <MenuItem key={value2} value={key2}>{key2}</MenuItem>
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className={classes.root}>
                                    <Button variant="contained" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={handleSave}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </Fade>
                    </Modal>
                </div>
                <div className="Finvizscreener__pagination">
                    <ArrowBack onClick={pageBackward} />
                    {page}/{screenerData.page}
                    <ArrowForward onClick={pageForward} />
                </div>
            </div>
            {/* Screener */}
            {Object.keys(screenerData).length > 0 ?(
                <Screenertable screenerData={screenerData} order={order} ascend={ascend} orderClick={orderClick}/>
            ):(
                <h3>No Available Data.</h3>
            )}

        </div>
    )
}

export default Finvizscreener
