import { useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Typography, Box, Button, TextField, FormControl, MenuItem, InputLabel, Select, Card, CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Icono para eliminar
import { PaymentContext } from './PaymentContext';

export const PaymentForm = ({ bankDiscounts, showSaleForm, bankList }) => {
  const [idempotencyID, setIdempotencyID] = useState(uuidv4());
  const [offerList2, setOfferList2] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]); // Para múltiples métodos de pago
  const { setPaymentData, finalAmount, setFinalAmount, 
          descripcionPlan, setDescripcionPlan, 
          cuotas, setCuotas } = useContext(PaymentContext);
  const [finalAmountFixed, setFinalAmountFixed] = useState(0);
  let sumaDeMontos = 0;

  const fetchBankOffers = async (bankId, index) => {
    try {    
      const response = await fetch(`http://localhost:3000/sql/getBankOffer/${bankId}`); // Cambia por tu API real
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }            
      const result = await response.json();
      // Actualizar las ofertas de bancos para el método de pago en su índice correspondiente
      setPaymentMethods((prevMethods) => {
        const updatedMethods = [...prevMethods];
        updatedMethods[index].offerList = result;
        return updatedMethods;
      });
      console.log(result);
    } catch (error) {
      console.error('Error fetching SQL data:', error);
    }
  };

  useEffect(() => {
    // Inicialmente agregar una tarjeta fija al renderizar
    setPaymentMethods([
      {
        monto: finalAmount,
        installments: 1,
        isFixed: true, // Esta tarjeta no será editable
        idempotencyID: uuidv4(), // Genera un ID único por tarjeta
        isPaid: false, // Para trackear si está paga
        selectedBank: '', // Banco seleccionado por método
        offerList: [], // Lista de ofertas por banco
      },
    ]);
    setFinalAmountFixed(finalAmount);
  }, []);

  const handlePayment = async () => {
    for (let i = 0; i < paymentMethods.length; i++) {
      console.log(paymentMethods[i]);
      /*const method = paymentMethods[i];
      if (!method.isPaid) {
        try {
          // Enviar el fetch POST por cada tarjeta
          await processPayment(method);
          // Marcar la tarjeta como pagada
          setPaymentMethods((prevMethods) => {
            const updatedMethods = [...prevMethods];
            updatedMethods[i].isPaid = true;
            return updatedMethods;
          });
        } catch (error) {
          console.error('Error procesando el pago:', error);
          break;
        }
      }*/
    }
  };

  const processPayment = async (method) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'X-Clover-Device-Id': 'C045LQ34660687',
        'X-POS-Id': 'Clover Flex',
        'Idempotency-Key': method.idempotencyID,
        'content-type': 'application/json',
        authorization: `Bearer 12f6a5fd-d7be-5c58-5964-b6fb74d9f5a8`,
      },
      body: JSON.stringify({
        capture: true,
        deviceOptions: {
          cardEntryMethods: ['MAG_STRIPE', 'EMV', 'NFC'],
        },
        final: true,
        regionalExtras: {
          argentina: {
            invoiceNumber: `FACT-${method.idempotencyID.slice(-6)}`,
            numInstallments: method.installments,
          },
        },
        amount: method.monto,
        externalPaymentId: `PAY-${method.idempotencyID.slice(-12)}`,
      }),
    };

    const response = await fetch('https://sandbox.dev.clover.com/connect/v1/payments', options);
    const data = await response.json();
    console.log('Pago exitoso:', data);
    return data;
  };

  const addPaymentMethod = () => {
    // Añadir un nuevo medio de pago editable
    setPaymentMethods((prev) => [
      ...prev,
      {
        monto: 0,
        installments: 1,
        isFixed: false,
        idempotencyID: uuidv4(),
        isPaid: false,
        selectedBank: '', // Banco seleccionado por método
        offerList: [], // Lista de ofertas para el nuevo método
      },
    ]);
  };

  const updatePaymentMethod = (index, field, value) => {
    setPaymentMethods((prevMethods) => {
      const updatedMethods = [...prevMethods];
      updatedMethods[index][field] = value;


      if(field=='monto'){
        sumaDeMontos = 0;
        console.log(typeof(sumaDeMontos));
        updatedMethods.forEach((method)=>{
          if(!method.isFixed){
            sumaDeMontos += parseFloat(method.monto);
          }
        });
  
        setFinalAmount(finalAmountFixed-sumaDeMontos);
      }
      return updatedMethods;
    });
  };

  const removePaymentMethod = (index) => {
    // Eliminar el método de pago basado en su índice, si no es el primero
    setPaymentMethods((prevMethods) => prevMethods.filter((_, i) => i !== index));
  };

  return (
    <Box 
      sx={{
        width: '700px',
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
      
      {paymentMethods.map((method, index) => (
        <Card key={index} sx={{ marginBottom: '20px', opacity: method.isPaid ? 0.6 : 1, position: 'relative' }}>
          <CardContent sx={{ display:'flex', justifyContent:'space-between'}}>
            {method.isFixed ? (
              <>
                <Typography>{descripcionPlan}</Typography>
                <Typography>
                  {cuotas} cuotas de ${finalAmount / cuotas}
                </Typography>
                <Typography>
                  Monto Total: ${finalAmount}
                </Typography>
              </>
            ) : (
              <>
                <TextField
                  select
                  label="CUENTA BANCARIA"
                  value={method.selectedBank}
                  onChange={(e) => {
                    updatePaymentMethod(index, 'selectedBank', e.target.value);
                    fetchBankOffers(e.target.value, index);
                  }}
                  fullWidth
                  sx={{ marginBottom: '.5rem', alignSelf:'end' }}
                >
                  {bankList.map((bank) => (
                    <MenuItem key={bank.IdPosnet} value={bank.IdPosnet}>
                      {bank.Descripcion}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Monto"
                  value={method.monto}
                  onChange={(e) => updatePaymentMethod(index, 'monto', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{marginX:'1rem'}}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Cuotas</InputLabel>
                  <Select
                    value={method.installments}
                    onChange={(e) => updatePaymentMethod(index, 'installments', e.target.value)}
                    label="Cuotas"
                  >
                    {method.offerList.map((bankDiscount, idx) => (
                        <MenuItem key={idx} value={bankDiscount.Cuota}>
                          {bankDiscount.Cuota} Cuotas
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Botón de eliminar para medios de pago adicionales */}
                <IconButton
                  onClick={() => removePaymentMethod(index)}
                  sx={{ position: 'absolute', top: '10px', right: '10px' }}
                  color="error"
                  disabled={method.isPaid} // No eliminar si ya está pagado
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={addPaymentMethod}
        variant="outlined"
        color="primary"
        fullWidth
        sx={{ marginBottom: '20px' }}
      >
        + Agregar medio de pago
      </Button>

      <Button
        onClick={handlePayment}
        variant="contained"
        color="primary"
        fullWidth
      >
        Pagar
      </Button>
    </Box>
  );
};