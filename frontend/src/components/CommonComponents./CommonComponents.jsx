import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from '../Navbar/Navbar';
import isTokenValid from '../../helpers/isTokenValid';
import TokenValidityAlert from '../TokenValidityAlert/TokenValidityAlert';

const CommonComponents = (props) => {
    const [isTokenAlert, setTokenAlert] = useState(false);
    const [isTokenRefreshed, setTokenRefreshed] = useState(true);

    const token = localStorage.getItem('jwt_token');
    const navigate = useNavigate();

    useEffect(() => {
        
        const interval = 2000; //2 seconds
        const checkTokenExpiration = () => {
            const threshold = 20000; //20 seconds
            const timeToExpiry = isTokenValid(token)*1000;
            if(timeToExpiry){
                if(timeToExpiry<threshold && isTokenRefreshed){
                    setTokenAlert(true);
                    setTokenRefreshed(false);
                }
            }
            else{
                let path = '/';
                localStorage.removeItem("currentUserEmail");
                localStorage.removeItem("jwt_token");
                navigate(path);
            }
        }

        checkTokenExpiration();

        const intervalId = setInterval(checkTokenExpiration, interval);

        return () => clearInterval(intervalId);
    })

    return(
        <>
            <TokenValidityAlert
                isTokenAlert={isTokenAlert}
                setTokenAlert={setTokenAlert}
                setTokenRefreshed={setTokenRefreshed}
                userInfo={props.items} 
            />
            <Navbar/>
        </>
    )
}

export default CommonComponents;
