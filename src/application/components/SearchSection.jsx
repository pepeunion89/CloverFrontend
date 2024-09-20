/*import { Typography, Box, Button, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

export const SearchSection = () => {
  const [idempotencyID, setIdempotencyID] = useState(uuidv4());
  const [cloverID, setCloverID] = useState('');
  const [monto, setMonto] = useState('');
  const [sellResponse, setSellResponse] = useState();
  const [externalPaymentId, setExternalPaymentId] = useState('');
  const urlCloverToken = 'https://sandbox.dev.clover.com/oauth/merchants/350REZA62F0T1?client_id=T663FGQ2S6V60&packageName=UNKNOWN';

  const getResponseAndGenerateNewId = async () => {
    console.log("Idempotency: " + idempotencyID + "\n" + 
      "CloverID: " + cloverID + "\n" + 
      "Monto: " + monto
    );

    await preAuthPayment(); // Pre-autorización
    //await verifyBIN(); // Verificación del BIN y posible descuento
    //await capturePayment(); // Captura del pago
    generateNewIdempotencyID();
  };

  const generateNewIdempotencyID = () => {
    setIdempotencyID(uuidv4());
  };

  // Paso 1: Pre-autorización
  const preAuthPayment = async () => {
    
    try {
      const response = await fetch('https://sandbox.dev.clover.com/connect/v1/payments', options);
      if (!response.ok) {
        console.error(response);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSellResponse(data);
      setExternalPaymentId(data.id); // Guarda el externalPaymentId para la captura posterior
      console.log("Pre-autorización completa: ", data);
    } catch (err) {
      console.error('Error en la pre-autorización:', err);
    }
  };

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'X-Clover-Device-Id': 'C045LQ34660687',
      'X-POS-Id': 'Clover Flex',
      'Idempotency-Key': idempotencyID,
      'content-type': 'application/json',
      authorization: `Bearer ${cloverID}`
    },
    body: JSON.stringify({
      capture: false, // Pre-autorización
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
      final: false, // Permitir ajustes antes de capturar el pago
      amount: monto,
      externalReferenceId: `TEST${idempotencyID.slice(-12)}`
    })
  };


  // Paso 2: Verificación del BIN
  const verifyBIN = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-Clover-Device-Id': 'C045LQ34660687',
        'X-POS-Id': 'Clover Flex',
        authorization: `Bearer ${cloverID}`
      }
    };

    try {
      const response = await fetch(`https://sandbox.dev.clover.com/connect/v1/payments/external/${externalPaymentId}`, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const bin = data.cardTransaction.cardNumber.substring(0, 6);
      console.log('BIN obtenido:', bin);

      // Aquí podrías hacer la verificación del BIN y ajustar el monto si aplica
      if (bin.startsWith('123456')) {
        // Ejemplo: Si el BIN pertenece a un banco con descuento
        const discount = 0.10;
        setMonto((prevMonto) => (prevMonto * (1 - discount)).toFixed(2));
        console.log('Descuento aplicado, nuevo monto:', monto);
      }
    } catch (err) {
      console.error('Error obteniendo detalles del pago:', err);
    }
  };

  // Paso 3: Captura del pago
  const capturePayment = async () => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'X-Clover-Device-Id': 'C045LQ34660687',
        'X-POS-Id': 'Clover Flex',
        'Idempotency-Key': idempotencyID,
        'content-type': 'application/json',
        authorization: `Bearer ${cloverID}`
      },
      body: JSON.stringify({
        amount: monto, // Monto ajustado
      })
    };

    try {
      const response = await fetch(`https://sandbox.dev.clover.com/connect/v1/payments/${externalPaymentId}/capture`, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Pago capturado:', data);
    } catch (err) {
      console.error('Error capturando el pago:', err);
    }
  };

  const handleGenerateBearer = () => {
    window.open(urlCloverToken, '_blank', 'width=600,height=600');
  };

  const onCloverBaererChanged = ({ target }) => {
    setCloverID(target.value);
  };

  const onMontoChanged = ({ target }) => {
    setMonto(target.value);
  };

  return (
    <>
      <Box className="Search-container">
        <Typography variant="h6" noWrap component="div" sx={{ p: 2, border: '1px dashed grey' }}>
          Datos para la consulta
        </Typography>
        <Box className="idempotency-container" sx={{ display: 'flex', mt: '1rem', alignItems: 'center' }}>
          <Typography variant="h5">Idempotency-Key</Typography>
          <Typography sx={{ background: 'lightyellow', fontWeight: 'bold', padding: '1rem' }}>
            {idempotencyID}
          </Typography>
        </Box>
        <Box className="caja generate-clover-baerer">
          <Button onClick={handleGenerateBearer}>GENERATE CLOVER BAERER</Button>
          <TextField
            onChange={onCloverBaererChanged}
            value={cloverID}
            sx={{ background: 'lightyellow', fontWeight: 'bold' }}
          />
        </Box>
        <Box className="caja monto-container">
          <Typography variant="h5">Monto</Typography>
          <TextField onChange={onMontoChanged} value={monto} id="outlined-basic" placeholder="$0" variant="outlined" />
        </Box>
        <Button variant="contained" sx={{ mt: '1rem' }} onClick={getResponseAndGenerateNewId}>
          PAGAR
        </Button>
      </Box>
    </>
  );
};

*/import { Typography, Box, Button, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

export const SearchSection = () => {
  const [idempotencyID, setIdempotencyID] = useState(uuidv4());
  const [cloverID, setCloverID] = useState('');
  const [monto, setMonto] = useState('');
  const [sellResponse, setSellResponse] = useState();
  const [paymentId, setPaymentId] = useState('');
  const [lastCloverToken, setLastCloverToken] = useState(''); 

  const urlCloverToken = 'https://sandbox.dev.clover.com/oauth/merchants/350REZA62F0T1?client_id=T663FGQ2S6V60&packageName=UNKNOWN';

  const getLastCloverToken = async () => {
    try {
      const response = await fetch('http://localhost:3000/getLastToken');
      const data = await response.json();
      setLastCloverToken(data.cloverToken);
      setCloverID(data.cloverToken);
      console.log('Último token:', data.cloverToken);
    } catch (error) {
      console.error('Error fetching last Clover token:', error);
    }
  };

  const getResponseAndGenerateNewId = async () => {
    console.log("Idempotency: " + idempotencyID + "\n" +
      "CloverID: " + cloverID + "\n" +
      "Monto: " + monto);

    await getResponse();
    generateNewIdempotencyID();
  };

  const generateNewIdempotencyID = () => {
    return new Promise((resolve) => {
        setIdempotencyID(uuidv4());
        resolve();
        console.log("GENERO EL IDEMPOTENCY");
    });
  };


  const handleGenerateBearer = () => {
    return new Promise((resolve) => {
        window.open(urlCloverToken, '_blank', 'width=600,height=600,resizable=0');
        setTimeout(() => {
            getLastCloverToken();
            resolve();
            console.log("GENERO EL CLOVER ID");
        }, 3000);
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
        authorization: `Bearer ${cloverID}`
      },
      body: JSON.stringify({
        capture: false,
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
        final: false,
        amount: monto,
        externalPaymentId: `TEST${idempotencyID.slice(-12)}`
      })
    };

    try {
      const response = await fetch('https://sandbox.dev.clover.com/connect/v1/payments', options1);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSellResponse(data);
      setPaymentId(data.payment.id);

      console.log("Respuesta: ", data);
      console.log("PaymentID: " + data.payment.id);      
      // Confirmar el pago
      const confirmResponse = window.confirm("¿Confirma el pago?");
      console.log(confirmResponse);
      if (confirmResponse) {
        await confirmPayment(data.payment.id); // Solo llama a confirmPayment si está confirmado
      }

    } catch (err) {
      console.error('Error fetching response:', err);
    }
  };

  // CONFIRMACION DEL PAGO ------------------------------------------------------------
  const confirmPayment = async (paymentId) => {
    
    await generateNewIdempotencyID()
    .then(() => handleGenerateBearer())
    .then(() => new Promise(resolve => setTimeout(resolve, 5000)))
    .then(() => executeCapture(paymentId))
    .catch(err => {
      console.error('Error en el flujo de confirmación:', err);
    });
   
  };
  

  const executeCapture = async (paymentId) => {
    console.log("ENTRA EN CAPTURE");
    const options2 = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'X-Clover-Device-Id': 'C045LQ34660687',
        'X-POS-Id': 'Clover Flex',
        'Idempotency-Key': idempotencyID, // Asegúrate de que este sea el nuevo idempotencyID
        'content-type': 'application/json',
        authorization: `Bearer ${cloverID}` // Asegúrate de que este sea el nuevo cloverID
      },
      body: JSON.stringify({ amount: monto })
    };
  
    console.log('Idempotency-Key:' + idempotencyID + '\n' +
                'authorization:' + `Bearer ${cloverID}` + '\n' +
                'monto:' + monto + '\n'
    );
  
    try {
      const response = await fetch(`https://sandbox.dev.clover.com/connect/v1/payments/${paymentId}/capture`, options2);
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

  
  const onCloverBaererChanged = ({ target }) => {
    setCloverID(target.value);
  };

  const onMontoChanged = ({ target }) => {
    setMonto(target.value);
  };

  return (
    <>
      <Box className="Search-container">
        <Typography variant='h6' noWrap component='div' sx={{ p: 2, border: '1px dashed grey' }}>
          Datos para la consulta
        </Typography>
        <Box className='idempotency-container' sx={{ display: 'flex', mt: '1rem', alignItems: 'center' }}>
          <Typography variant='h5'>
            Idempotency-Key
          </Typography>
          <Typography className='idempotency-token' sx={{ background: 'lightyellow', fontWeight: 'bold', padding: '1rem' }}>
            {idempotencyID}
          </Typography>
        </Box>
        <Box className='caja generate-clover-baerer'>
          <Button onClick={handleGenerateBearer}>GENERATE CLOVER BAERER</Button>
          <Typography className='clover-token' onChange={onCloverBaererChanged}
            sx={{ background: 'lightyellow', fontWeight: 'bold' }}>   
            {cloverID}  
          </Typography> 
        </Box>
        <Box className='caja monto-container'>
          <Typography variant='h5'>
            Monto
          </Typography>
          <TextField onChange={onMontoChanged}
            value={monto}
            id="outlined-basic"
            placeholder="$0"
            variant="outlined" />
        </Box>
        <Button variant="contained" sx={{ mt: '1rem' }} onClick={getResponseAndGenerateNewId}>PAGAR</Button>
      </Box>
    </>
  );
};