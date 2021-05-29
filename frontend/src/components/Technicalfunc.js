import React, {useState} from "react"
import { makeStyles } from "@material-ui/core/styles";
import {Modal, Backdrop, Fade, Button} from "@material-ui/core";
import "./Technicalfunc.css"

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "#222838",
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const overlay = [
    {label: "None", value: ""},
    {label: "EMA", value: "ema"},
    {label: "Bollinger Bands", value: "bb"}
]

const oscillator = [
    {label: "None", value: ""},
    {label: "MACD", value: "macd"},
    {label: "RSI", value: "rsi"},
    {label: "Stoch", value: "stoch"}
]

function Technicalfunc({indicators, setIndicators}) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <div className="TaButton" onClick={handleOpen}>
                fx
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
                <div className={`${classes.paper} Technicalfunc__indicators`}>
                    <div>
                        <h3>Overlay</h3>
                        <div className="Technicalfunc__overlay">
                            {overlay.map((indicator, index)=>{
                                return (
                                    <div key={`overlay_${index}`} 
                                        onClick={() => setIndicators({...indicators, overlay:indicator.value})}
                                        className={indicators.overlay === indicator.value ? "Technicalfunc__active": "Technicalfunc__indicator"}>
                                        {indicator.label}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <h3>Oscillator </h3>
                        <div className="Technicalfunc__oscillator">
                            {oscillator.map((indicator, index)=>{
                                return (
                                    <div key={`oscillator_${index}`}  
                                        onClick={() => setIndicators({...indicators, oscillator:indicator.value})}
                                        className={indicators.oscillator === indicator.value ? "Technicalfunc__active": "Technicalfunc__indicator"}>
                                        {indicator.label}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                </Fade>
            </Modal>

        </div>
    )
}

export default Technicalfunc
