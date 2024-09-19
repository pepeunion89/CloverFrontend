import { Button, Grid2, Link, TextField, Typography } from "@mui/material"
import { Link as RouterLink} from 'react-router-dom';
import {AuthLayout} from '../layout'

export const RegisterPage = () => {
  return (
    <>
        <AuthLayout title="Crear cuenta">

          <form action="">

            <Grid2>

            <Grid2 item xs={12} sx={{mt: 2}}>
                <TextField label="Nombre completo" type="text" placeholder="Tu nombre..." fullWidth />
              </Grid2>

              <Grid2 item xs={12} sx={{mt: 2}}>
                <TextField label="Correo" type="email" placeholder="correo@google.com" fullWidth />
              </Grid2>

              <Grid2 item xs={12} sx={{mt: 2}}> 
                <TextField label="Contraseña" type="password" placeholder="****" fullWidth />
              </Grid2>

              <Grid2 container spacing={2} sx={{mb:2}}> 
                <Grid2 item xs={12} >
                  <Button variant="contained" fullWidth sx={{mt:1}}>
                    Crear cuenta
                  </Button>
                </Grid2>                
              </Grid2>
              
              <Grid2 container direction='row' justifyContent='end'>
                <Typography sx={{mr: 1}}>¿Tienes una cuenta?</Typography>
                <Link component={RouterLink} color='inherit' to="/auth/login">
                  Ingresar
                </Link>
              </Grid2>

            </Grid2>

          </form>

        </AuthLayout>
            

    </>
  )
}