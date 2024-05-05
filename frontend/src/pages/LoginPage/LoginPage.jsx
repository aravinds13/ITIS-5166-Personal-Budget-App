import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";

import errorMessages from "../../helpers/errorMessages";
import isTokenValid from "../../helpers/isTokenValid";
import './LoginPage.scss'

import Hashes from 'jshashes';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3008;


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isError, setError] = useState(false);
  const [isLogin, setLogin] = useState(true);
  const [errorType, setErrorType] = useState("missing_cred");
  let navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem("jwt_token")
    if(token){
      if (isTokenValid(token)) {
        navigate('/dashboard');
      }
    }
  },[])

  const errorList = errorMessages.login;

  const handleLogin = () => {
    if(!isLogin && name.trim() === ""){
      setErrorType("missing_name");
      setError(true);
    }
    else if(email.trim() === "" || password.trim() === ""){
      setErrorType("missing_cred");
      setError(true);  
    }
    
    else{
      const url = `${BASE_URL}:${SERVER_PORT}/api/v1/${(isLogin?'login':'signup')}`;
      const data = {
        name: name,
        email: email,
        password: new Hashes.SHA256().hex(password)
      }
      let responseBody = {}
      axios({
        method: 'post',
        url,
        headers: {},
        data
      }).then((response) => {
          responseBody = response.data;
          localStorage.setItem("jwt_token", responseBody.token)
          goToDashboardOrModify(responseBody);
        })
        .catch((err) => {
          switch (err.response.status){
            case 400:
              setErrorType("user_exists");
              setError(true);
              break;
            case 401:
              setErrorType("invalid_cred");
              setError(true);
              break;
            default:
              console.log("whaaaat?!");
              
          } 
        })
  
    }
  }

  const handleSwitch = () => {
    setEmail("");
    setPassword("");
    setName("");
    setLogin(!isLogin);
    setError(false);
  }

  const goToDashboardOrModify = (data) => {
    let path = isLogin ? '/dashboard':'/modify';
    navigate(path, {state : data});
  }


    return (
      <div className="main-container">
        <div className="left-container">
          <div className="login-container">
            <h1>{isLogin ? 'Login' : 'Signup'}</h1>
            <div>
              {
                !isLogin &&
                <TextField 
                  id="outlined-basic"
                  label="Name"
                  variant="standard"
                  aria-label="textfield-name"
                  value={name}
                  onChange={e => {setName(e.target.value)}}
                />
              }
            </div>
            <div>
              <TextField 
                id="outlined-basic"
                label="Email"
                variant="standard"
                aria-label="textfield-email"
                value={email}
                onChange={e => {setEmail(e.target.value)}}
              />
            </div>
            <div>
              <TextField 
                id="outlined-basic"
                label="Password"
                variant="standard"
                aria-label="textfield-password"
                value={password}
                type='password'
                onChange={e => {setPassword(e.target.value)}}
              />
            </div>

            { isError && 
                <div className="error-text">{errorList[errorType]}</div>
            }

            <div
              className="switch-mode-text"
            >
              <>{isLogin ? 'Don\'t' : 'Already'} have an account? </>
              
              <a onClick={() => handleSwitch()} href="#">
                {isLogin ? 'Create one here.' : 'Login here.'}
              </a>
            </div>
            <Button
              variant="outlined"
              aria-label="button-login"
              onClick={() => handleLogin()}
            >
              {isLogin ? `Login` : `Signup`}
            </Button>
          </div>
        </div>
        <div className="right-container">
            <div className="welcome-text">
              <h1>Hello!</h1>
              <h1>Welcome to Personal Budget Calculator</h1>
            </div>
        </div>
      </div>
    );
  }
  
  export default LoginPage;
