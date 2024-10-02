import { useState, useEffect } from 'react';
import { Box, Button, MenuItem, TextField, Typography, InputAdornment, OutlinedInput } from '@mui/material';


export const DemoParametersPayment = ({setBoolDemo, setBoolBINSearch, bankList}) => {

    const [offerList, setOfferList] = useState([]);
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedOffer, setSelectedOffer] = useState('');
    const [initialAmount, setInitialAmount] = useState(0.00); // Ejemplo de monto inicial
    const [finalAmount, setFinalAmount] = useState(initialAmount);

 
    const onSelectedBank = async(e)=>{

        setSelectedBank(e.target.value);

        try {    
            const response = await fetch(`http://localhost:3000/sql/getBankOffer/${e.target.value}`); // Cambia por tu API real
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }            
            const result = await response.json();
            setOfferList(result);
            console.log(result);
          } catch (error) {
            console.error('Error fetching SQL data:', error);
          }
    };
        
    const onInitialAmountChanged = (e)=>{

        setInitialAmount(parseFloat(e.target.value));

        if(selectedBank!='' && selectedOffer!=''){
            onSelectOffer(selectedOffer);
            console.log(selectedOffer);
        }else{
            setFinalAmount(parseFloat(e.target.value));
        }       

    }

    const onChangeOffer = (e)=>{

        setSelectedOffer(e.target.value);

    }

    const onSelectOffer = (offer)=>{

        if(initialAmount>0){
            setFinalAmount(initialAmount*(1-(parseInt(offer.Variacion)/(-100))));
        }      

    }
  
    const handleSubmit = () => {
      if(finalAmount>0){
        setBoolDemo(false);
        setBoolBINSearch(true);
      }
    };

  return (
    <>
        <Box
            sx={{
                maxWidth: '500px',
                margin: '5rem auto',
                padding: '2rem',
                borderRadius: '10px',
                backgroundColor: '#f5f5f5',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
            >
            <Typography variant="h4" textAlign="center" gutterBottom>
                Demo de Pago VB6
            </Typography>

            {/* MONTO INICIAL */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Typography variant="h6" sx={{ marginRight: '1rem' }}>
                MONTO INICIAL:
                </Typography>
                <OutlinedInput
                value={initialAmount}
                onChange={onInitialAmountChanged}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                type="number"
                sx={{ width: '200px' }}
                />
            </Box>

            {/* CUENTA BANCARIA */}
            <TextField
                select
                label="CUENTA BANCARIA"
                value={selectedBank}
                onChange={onSelectedBank}
                fullWidth
                sx={{ marginBottom: '1.5rem' }}
            >
                {bankList.map((bank) => (
                <MenuItem key={bank.IdPosnet} value={bank.IdPosnet}>
                    {bank.Descripcion}
                </MenuItem>
                ))}
            </TextField>

            {/* OFERTAS */}
            <TextField
                select
                label="OFERTAS"
                value={selectedOffer}
                onChange={onChangeOffer}
                fullWidth
                sx={{ marginBottom: '1.5rem' }}
            >
                {offerList.map((offer) => (
                <MenuItem key={offer.Descripcion} value={offer.Descripcion} sx={{display:'flex'}} onClick={()=>onSelectOffer(offer)}>
                    <Box sx={{marginRight:'auto'}}>{offer.Descripcion}</Box><Box sx={{justifiSelf:'flex-end'}}> + {String(offer.Variacion).substr(1)}% de descuento</Box>
                </MenuItem>
                ))}
            </TextField>

            {/* MONTO FINAL */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Typography variant="h6" sx={{ marginRight: '1rem' }}>
                MONTO FINAL:
                </Typography>
                <OutlinedInput
                value={finalAmount}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                type="number"
                disabled
                sx={{ width: '200px', backgroundColor: '#e0e0e0' }} // Fondo gris para mostrar que es readonly
                />
            </Box>

            {/* BOTÓN DE PAGO */}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleSubmit}
            >
                IR A PAGAR
            </Button>
        </Box>
    </>
  )
}
