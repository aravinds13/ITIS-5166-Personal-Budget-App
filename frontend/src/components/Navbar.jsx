import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import './Navbar.scss';

const pages = ['Dashboard', 'Modify', 'Logout'];

function ResponsiveAppBar() {
  let navigate = useNavigate();

  const handleClick = (page) => {
    let path = `/${page.toLowerCase()}`
    if(page === "Logout"){
        path = '/';
        localStorage.removeItem("currentUserEmail");
        localStorage.removeItem("jwt_token");
    }
    navigate(path);
  }

  return (
    <AppBar position="static" sx={{backgroundColor: 'black'}}>
      <Container maxWidth="100%">
        <Toolbar disableGutters style={{display:'grid', gridTemplateColumns:'repeat(2, 50%)'}}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Tahoma, Arial',
              fontWeight: 300,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            style={{gridColumn: 1, justifySelf: "start"}}
            aria-label="title-personal-budget-app"
          >
            Personal Budget App
          </Typography>
          

          <Box sx={{ display: { xs: 'none', md: 'flex' } }} style={{gridColumn: 2, justifySelf: "end"}}>
            {pages.map((page) => (
            <MenuItem>
              <Button
                key={page}
                onClick={()=>{handleClick(page)}}
                sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'Tahoma, Arial'}}
                className='item'
                aria-label={`menu-button-${page}`}
              >
                {page}
              </Button>
              </MenuItem>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
