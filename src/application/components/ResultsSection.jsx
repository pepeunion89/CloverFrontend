import { useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Typography, Button, Box } from '@mui/material';
import { PaymentContext } from './PaymentContext'; // Importa el contexto

export const ResultsSection = () => {
  const { paymentData, setPaymentData } = useContext(PaymentContext); 
  const [idempotencyID, setIdempotencyID] = useState(uuidv4());
  const merchantID = 'T663FGQ2S6V60';

  useEffect(() => {
    if (paymentData && paymentData.payment.cardTransaction.first6) {
      //getBankName(paymentData.payment.cardTransaction.first6);
    }
  }, [paymentData]);
  
  const confirmPayment = async () => {
    
    await generateNewIdempotencyID()
    //.then(() => handleGenerateBearer())
    .then(() => new Promise(resolve => setTimeout(resolve, 5000)))
    .then(() => executeCapture(paymentData))
    .catch(err => {
      console.error('Error en el flujo de confirmación:', err);
    });
   
  };

  const executeCapture = async (paymentData) => {
    const options2 = {
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
        amount: paymentData.payment.amount,
        regionalExtras: {
          argentina: {
            invoiceNumber: 'FACT-XXX',
            numInstallments: '12'  // Número de cuotas
          }
        }
      })
    };  
  
    try {
      console.log(options2);
      const response = await fetch(`https://sandbox.dev.clover.com/connect/v1/payments/${paymentData.payment.id}/capture`, options2);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      window.alert("PAGO FINALIZADO");
      console.log(data);
    } catch (err) {
      console.error('Error finishing payment', err);
    }
  };

  const generateNewIdempotencyID = () => {
    return new Promise((resolve) => {
        setIdempotencyID(uuidv4());
        resolve();
    });
  };


  


  return (
    <>{console.log(paymentData)}
      {/*<Box className="Search-container">
        <Typography variant='h6'>Información: Pago a autorizar</Typography>
          {paymentData ? (
            <Box sx={{ p: 2, border: '1px dashed grey', display: 'flex', flexDirection:'column'}}>
              <Typography>Payment ID: {paymentData.payment.id}</Typography>
              <Typography>
                Monto: ${(
                  (paymentData.payment.amount / 100).toFixed(2) // Dividimos por 100 y formateamos a dos decimales
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".") // Aca agregamos puntos como separadores de miles
                    .replace(".", ",") // Y por ultimo cambiamos el último punto por una coma
                )}
              </Typography>
              <Typography sx={{fontWeight:'bold'}}>Banco: {bankName}</Typography>
              <Typography>N° de Tarjeta: {paymentData.payment.cardTransaction.first6}******{paymentData.payment.cardTransaction.last4}</Typography>
              <Typography>Tipo: {paymentData.payment.cardTransaction.cardType} - {paymentData.payment.tender.label}</Typography>
              <Typography>N° de Lote: {paymentData.payment.cardTransaction.extra.batchNumber}</Typography>
              <Typography>N° de Comercio: {merchantID}</Typography>
            </Box>
          ) : (
            <Typography>No hay información de pago aún</Typography>
          )} 
        <Button variant="contained" sx={{ mt: '1rem' }}  onClick={confirmPayment}>CONFIRMAR PAGO</Button> 
      </Box>*/}
    </>
  );
};