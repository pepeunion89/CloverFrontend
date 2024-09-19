import { LogoutOutlined, MenuOutlined } from "@mui/icons-material"
import { AppBar, Grid2, IconButton, Toolbar, Typography } from "@mui/material"

export const NavBar = () => {
  return (
   <AppBar position='fixed' >

        <Toolbar 
            className="Toolbar-container"            
            sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <IconButton color='inherit' edge="start" sx={{
                mr: 2, display: {sm:'none'}
            }}>
                <MenuOutlined />
            </IconButton>
            <Grid2 container direction='row' justifyContent='space-between' align-items='center'>
                <Typography 
                            variant='h6' 
                            noWrap 
                            component='div'>
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