import {useState} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import './ExpenseCard.scss';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: "5px",
    p: 4,
  };



const ExpenseCard = (props) => {

    const [isModalOpen, setModalOpen] = useState(false);
    const {total, budget, month, expenses} = props.expenseDetails;

    return (
        <>
        <Modal
            open={isModalOpen}
            onClose={()=>setModalOpen(false)}
        >
            <Box sx={style}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(20, 5%)'}}>
                    <div style={{gridColumn: 1}}>
                        <Typography variant="h5">
                            {month}
                        </Typography>
                    </div>
                    <div style={{gridColumn: 20}}>
                        <CloseIcon 
                            onClick={()=>{setModalOpen(false)}}
                            className='icon'
                            />
                    </div>
                </div>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Budget: $ {budget} | Total spent: $ {total}
                </Typography>
                {  
                    Object.entries(expenses)
                        .map(([key, value]) => {
                            return (
                                <div style={{display:'grid', gridTemplateColumns:'repeat(2, 50%)'}}>
                                    <div style={{gridColumn: 1, marginBottom:5}}>
                                        {key}
                                    </div>
                                    <div style={{gridColumn: 2, marginBottom:5}}>
                                        $ {value}
                                    </div>
                                </div>
                            )
                        })
                }
                <br />
                <Typography sx={{ mb: 1.5 }} color="text.primary">
                    Report: {budget>total || budget===total ?
                        <><span style={{color: "green"}}>WITHIN BUDGET</span></>:
                        <><span style={{color: "red"}}>OVERSPENT</span></>
                        }
                    <br/>{Math.floor(((total)/budget)*100)}% utilization
                </Typography>
            </Box>
        </Modal>
        <Card sx={{ minWidth: 260, minHeight: 200, bgcolor: 'background.paper',borderRadius: "5px"}} variant='outlined'>
        <CardContent>
            <Typography variant="h5">
            {props.expenseDetails.month}
            </Typography>
            {Object.keys(props.expenseDetails.expenses).length !== 0 ? (
            <>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Budget: $ {props.expenseDetails.budget} | Total spent: $ {props.expenseDetails.total}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.primary">
                    Report: {budget>total || budget===total ?
                        <><span style={{color: "green"}}>WITHIN BUDGET</span></>:
                        <><span style={{color: "red"}}>OVERSPENT</span></>
                        }
                    
                    <br/>{Math.floor(((total)/budget)*100)}% utilization
                    <br/>
                </Typography>
            </>
            ) :
            (
                <Typography color="text.secondary">No data available</Typography>
            )
            }
        </CardContent>
        {Object.keys(props.expenseDetails.expenses).length !== 0 &&(
            <CardActions>
                <Button size="small" onClick={()=>setModalOpen(true)}>View More</Button>
            </CardActions>
        )}
        
        </Card>
        </>
    );
    }

export default ExpenseCard;
