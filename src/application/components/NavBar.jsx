import { LogoutOutlined, MenuOutlined } from "@mui/icons-material"
import { AppBar, Grid2, IconButton, Toolbar, Typography, Box } from "@mui/material"

export const NavBar = () => {
  return (
   <AppBar sx={{backgroundColor:'#f2f8fc', position:'absolute'}}>

        <Toolbar 
            className="Toolbar-container"            
            sx={{display: 'flex', justifyContent: 'space-between', height:'100px'}}>
            <IconButton color='inherit' edge="start" sx={{
                mr: 2, display: {sm:'none'}
            }}>
                <MenuOutlined />
            </IconButton>
            <Box sx={{height:'100px'}}>
                <img src="/assets/atc.png" alt="" style={{height:'100px'}}/>
            </Box>
            <Grid2 container direction='row' justifyContent='space-between' align-items='center'>
                <Typography 
                            variant='h6' 
                            noWrap 
                            component='div'
                            sx={{color: 'darkblue'}}>
                    Get Auth Clover App
                </Typography>
                <IconButton color='error'>
                    <LogoutOutlined />
                </IconButton>
            </Grid2>
        </Toolbar>

   </AppBar>
  )
}