import {useState, useContext} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Typography, Box, Button, TextField, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import { PaymentContext } from './PaymentContext'; 

export const PaymentForm = ({bankDiscounts, bankSelected, showSaleForm}) => {

    const [monto, setMonto] = useState('');
    const [idempotencyID, setIdempotencyID] = useState(uuidv4());
    const [installments, setInstallments] = useState();
    const { setPaymentData } = useContext(PaymentContext); 

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí va la lógica para manejar el pago
        getResponseAndGenerateNewId();
        console.log(`Monto: ${monto}, Cuotas: ${installments}`);
    };

    const getResponseAndGenerateNewId = async () => {
        const response = await getResponse();
        generateNewIdempotencyID();
        setPaymentData(response);
        console.log(response);
      };
    
      const generateNewIdempotencyID = () => {
        return new Promise((resolve) => {
            setIdempotencyID(uuidv4());
            resolve();
        });
      };
    
      
      const getResponse = async () => {
        const options1 = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'X-Clover-Device-Id': 'C045LQ34660687',
            'X-POS-Id': 'Clover Flex',
            'Idempotency-Key': idempotencyID,
            'content-type': 'application/json',
            authorization: `Bearer 12f6a5fd-d7be-5c58-5964-b6fb74d9f5a8`
          },
          body: JSON.stringify({
            capture: true,
            deviceOptions: {
              disableCashback: false,
              offlineOptions: {
                allowOfflinePayment: false,
                approveOfflinePaymentWithoutPrompt: false,
                forceOfflinePayment: false
              },
              cardEntryMethods: ['MAG_STRIPE', 'EMV', 'NFC'],
              cardNotPresent: false
            },
            final: true,
            regionalExtras: {
              argentina: {
                invoiceNumber: 'FACT-XXX',
                numInstallments: installments  // Número de cuotas
              }
            },
            amount: monto,
            externalPaymentId: `TEST${idempotencyID.slice(-12)}`,         
          })
        };
    
        try {
          const response = await fetch('https://sandbox.dev.clover.com/connect/v1/payments', options1);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
    
          console.log("Respuesta: ", data);
          console.log("PaymentID: " + data.payment.id);      
    
          return data;
        } catch (err) {
          console.error('Error fetching response:', err);
        }
      };
      
      const onMontoChanged = ({ target }) => {
        setMonto(target.value);
      };
    
      const onInstallmentsSelect = ({target}) =>{
        setInstallments(target.value);
      }

  return (
    <>
        <Box 
            className='animate__animated animate__fadeIn'
            sx={{
                width: '400px', 
                margin: '20px auto', 
                padding: '20px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
                backgroundColor: '#fff',
            }}
        >
            <Typography variant="h5" align="center" sx={{ marginBottom: '20px', color: '#1976d2' }}>
                Realizar Pago
            </Typography>
            <form onSubmit={handleSubmit}>
                <Typography>
                  Cuenta Destino
                </Typography>
                <TextField 
                    label="Monto" 
                    variant="outlined" 
                    fullWidth 
                    margin="normal" 
                    value={monto} 
                    onChange={onMontoChanged} 
                    required 
                />
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Cuotas</InputLabel>
                    <Select 
                        value={installments} 
                        onChange={(e) => setInstallments(e.target.value)} 
                        label="Cuotas"
                    >
                      {bankDiscounts.map((bankDiscount, index)=> {
                          if(bankDiscount.IdTarjeta===bankSelected){
                            console.log("EL BANCO TIENE: \n");
                            console.log(bankDiscount);
                            return(
                              <MenuItem key={index} value={bankDiscount.Cuota} onChange={onInstallmentsSelect}> Cuota {bankDiscount.Cuota}</MenuItem>                              
                            );
                          }
                        return null;
                      })}
                    </Select>
                </FormControl>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ marginTop: '20px' }}
                >
                    Pagar
                </Button>
            </form>
        </Box>
    </>
  )
}
