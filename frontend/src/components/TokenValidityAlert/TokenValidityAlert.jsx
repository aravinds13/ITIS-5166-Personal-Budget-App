import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3008;

const handleRefresh = (userInfo, setTokenAlert, setTokenRefreshed) => {
    const token = localStorage.getItem("jwt_token");
    const url = `${BASE_URL}:${SERVER_PORT}/api/v1/refresh-token`;
    const data = {
        email: userInfo.email,
        name: userInfo.name
    }
    axios({
        method: 'post',
        url,
        headers: {'Authorization': `Bearer ${token}`},
        data
    }).then((response) => {
        localStorage.setItem("jwt_token",response.data.token);
        setTokenAlert(false);
        setTokenRefreshed(true);
    })
    .catch((err) => {
        console.log(err); 
    });
}

const TokenValidityAlert = (props) =>{
    return (
        <Dialog
            open={props.isTokenAlert}
            onClose={() => props.setTokenAlert(false)}
            aria-labelledby="token alert"
            aria-describedby="alert message to notify about auth token expiry"
        >
            <DialogTitle id="token-alert-title">
                {"Refresh auth token?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Your auth token will expire in 20 seconds. Do you want to refresh the token? If not, you will be logged out automatically after the token expires.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setTokenAlert(false)}>Close</Button>
                <Button onClick={() => {
                        handleRefresh(props.userInfo, props.setTokenAlert, props.setTokenRefreshed)
                    }} autoFocus>
                    Refresh
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default TokenValidityAlert;
