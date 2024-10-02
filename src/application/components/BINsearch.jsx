import { Typography, Box, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

export const BINsearch = ({setBoolBINSearch, setBoolPaymentForm, canProceed, setCanProceed, setBankDiscounts, binValue, setBinValue}) => {

  const [bankName, setBankName] = useState();  
    // Obtener el nombre del banco y si es crédito, buscar los descuentos
  const getBankName = async()=> {
    const url = `https://bin-ip-checker.p.rapidapi.com/?bin=${binValue}`;
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '94d80b65ddmsh70ed2d96148b447p1063a9jsnc5e82e0a452e',
        'x-rapidapi-host': 'bin-ip-checker.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bin: `${binValue}`,
        ip: '8.8.8.8'
      })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json(); 
      
      setBoolBINSearch(false);

      setBankName(result.BIN.issuer.name);
      
      if (result.BIN.type === "CREDIT") {
        //setCanProceed(true);
        //getBanksDiscount(); // Llamar a la función para obtener los descuentos
        setBoolPaymentForm(true);
      } else {
        setCanProceed(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

   // Obtener los descuentos de bancos según el BIN
   const getBanksDiscount = async () => {
    try {
      const response = await fetch('http://localhost:3000/sql/getBanksDiscount');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      setBankDiscounts(result); // Guarda los descuentos obtenidos    
      
    } catch (error) {
      console.error('Error fetching SQL getBanksDiscount:', error);
    }
  };



    const onBINChanged = ({ target }) => {
        setBinValue(target.value);
      };

  return (
    <>
        <Box className={canProceed ? 'binSearchContainer animate__animated animate__fadeIn' : 'binSearchContainer animate__animated animate__fadeIn'} 
              sx={{display:'flex', width:'500px', height:'50px', pt:'4rem', pb: '2rem', margin:'0 auto', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>              
          <Box sx={{display:'flex', position: 'relative', width: '400px', mt: canProceed ? '5rem' : ''}}>
            {/* TextField con label flotante */}    
            <Typography sx={{position:'absolute', 
                              width: '50%', 
                              backgroundColor:'#1976d2', 
                              color:'white', 
                              fontWeight:'bold', 
                              lineHeight:'62.5px', 
                              borderRadius:'10px 0 0 20px', 
                              zIndex:2,
                              textIndent:'1rem'
                              }}>
              VALIDAR TARJETA  
            </Typography>      
            <TextField
              onChange={onBINChanged}
              value={binValue}
              id="outlined-basic"
              label="N° Tarjeta"
              placeholder="eg. 123456"
              variant="outlined"
              sx={{
                width: '80%',
                zIndex:3,  
                marginLeft:'170px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white', // Fondo blanco solo en el área del input
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  padding: '0',
                  '& fieldset': {
                    borderColor: '#1976d2', // Borde color azul como el fondo de la lupa
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2', // Borde azul al hacer hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2', // Borde azul al hacer foco
                  },
                },
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                  padding: '14px 0',  // Ajusta para centrar el texto en el input
                  fontSize: '1.5rem',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1rem',
                  color: '#1976d2', // Color personalizado del label flotante
                },
                '& .Mui-focused .MuiInputLabel-root': {
                  color: '#1976d2', // Color del label cuando está enfocado
                },
              }}
              InputProps={{
                style: { borderRadius: '50px 0 0 50px'}, // Bordes redondeados
              }}
              inputProps={{
                maxLength: 6,
              }}
            />

            {/* Lupa flotante */}
            <SearchIcon
              sx={{
                width:'65px',
                height:'auto',
                position: 'absolute',
                top:'-1px',
                right: '-25px',
                backgroundColor: '#1976d2',
                color: 'white',
                padding: '8px',
                borderRadius: '50%',
                cursor: 'pointer',
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)', // Sombra
                transition: 'transform 0.2s',
                zIndex:4,
                '&:hover': {
                  transform: 'scale(1.1)', // Efecto hover
                },
              }}
              onClick={getBankName}
            />
          </Box>
          {bankName && (
            <Typography sx={{width:'516px', fontWeight:'bold', backgroundColor:'black', color:'#c5e2ff', py:'1.5rem', textAlign:'center', mt:'1rem', borderRadius:'10px'}}>
              {bankName}
            </Typography>
          )}
        </Box>
    </>
  )
}
