import React, {useState} from "react"
import { makeStyles } from "@material-ui/core/styles";
import {Modal, Grid, Backdrop, Fade, Button, TextField, InputAdornment} from "@material-ui/core";

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
    input: {
      '& .MuiTextField-root': {
        width: '90%',
        padding: '7px',
        margin: theme.spacing(1),
      },
      '& input':{
          color: 'rgb(209, 212, 220)'
      }
    },
    textField:{
        margin: theme.spacing(1),
    }
}));

function Portfoliomodal({addHandler, data, setData, error, open, setOpen}) {
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={`${classes.modal} Portfoliomodal`}
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
                <div>
                    <h3>Add</h3>
                    <form className={classes.input} onSubmit={addHandler}>
                        <Grid item xs={12}>
                            <TextField required 
                                label="Stock" 
                                placeholder="AAPL"
                                value={data.stock}
                                error={error.stock}
                                onChange={(e)=>setData({...data, stock:e.target.value.toUpperCase()})}/>
                            <TextField required 
                                label="Cost"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                value={data.cost}
                                error={error.cost}
                                onChange={(e)=>setData({...data, cost:e.target.value})}/>
                            <TextField required 
                                label="Shares"
                                value={data.shares}
                                error={error.shares}
                                onChange={(e)=>setData({...data, shares:e.target.value})}/>
                        </Grid>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            style={{margin: '8px'}}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
            </Fade>
        </Modal>
    )
}

export default Portfoliomodal
