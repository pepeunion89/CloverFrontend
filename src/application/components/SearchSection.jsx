import { Container, Typography, Box, Button, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useContext } from 'react';
import { PaymentContext } from './PaymentContext'; 
import SearchIcon from '@mui/icons-material/Search';

export const SearchSection = () => {
  const [idempotencyID, setIdempotencyID] = useState(uuidv4());  
  const [bin, setBin] = useState('');
  const [bankName, setBankName] = useState();
  const [canProceed, setCanProceed] = useState(false);
  const [monto, setMonto] = useState('');
  const { setPaymentData } = useContext(PaymentContext); 
  const [bankList, setBankList] = useState([]); // Estado para la lista de bancos
  const [bankDiscounts, setBankDiscounts] = useState([]); // Estado para los descuentos
  const [loadingBankList, setLoadingBankList] = useState(true); // Loading SQL para lista de bancos
  const [loadingDiscounts, setLoadingDiscounts] = useState(false); // Loading para descuentos

 
  // Obtener la lista de bancos desde SQL al cargar el componente
  useEffect(() => {
    const fetchBankList = async () => {
      try {
        const response = await fetch('http://localhost:3000/sql/getBankList');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setBankList(result); // Guarda los datos de bancos
        setLoadingBankList(false); // Desactiva el estado de carga
      } catch (error) {
        console.error('Error fetching SQL data:', error);
        setLoadingBankList(false); // Desactiva el estado de carga si hay error
      }
    };

    fetchBankList();
  }, []); // Ejecuta la llamada cuando el componente se monta

  if (loadingBankList) {
    return <div>Cargando lista de bancos...</div>;
  }

  // Obtener los descuentos de bancos según el BIN
  const getBanksDiscount = async () => {
    try {
      setLoadingDiscounts(true); // Activa el loading para descuentos
      const response = await fetch('http://localhost:3000/sql/getBanksDiscount');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setBankDiscounts(result); // Guarda los descuentos obtenidos
      setLoadingDiscounts(false); // Desactiva el loading
      
    } catch (error) {
      console.error('Error fetching SQL getBanksDiscount:', error);
      setLoadingDiscounts(false); // Desactiva el loading si hay error
    }
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

  // Obtener el nombre del banco y si es crédito, buscar los descuentos
  const getBankName = async()=> {
    const url = `https://bin-ip-checker.p.rapidapi.com/?bin=${bin}`;
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '94d80b65ddmsh70ed2d96148b447p1063a9jsnc5e82e0a452e',
        'x-rapidapi-host': 'bin-ip-checker.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bin: `${bin}`,
        ip: '8.8.8.8'
      })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json(); 
      setBankName(result.BIN.issuer.name);
      
      if (result.BIN.type === "CREDIT") {
        setCanProceed(true);
        getBanksDiscount(); // Llamar a la función para obtener los descuentos
      } else {
        setCanProceed(false);
      }
    } catch (error) {
      console.error(error);
    }
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
            numInstallments: '12'  // Número de cuotas
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

  const onBINChanged = ({ target }) => {
    setBin(target.value);
  };
  
  const onMontoChanged = ({ target }) => {
    setMonto(target.value);
  };

  return (
    <>
      <Container className="Search-container animate__animated animate__zoomIn" sx={{ p: 0, margin:'-3rem auto'}}>
        <Box className={canProceed ? 'binSearchContainer animate__animated animate__fadeIn' : 'binSearchContainer'} sx={{display:'flex', width:'500px', height:'50px', py:'4rem',margin:'0 auto', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>          
          <Box sx={{ position: 'relative', width: '220px', mt: canProceed ? '5rem' : ''}}>
            {/* TextField con label flotante */}
            <TextField
              onChange={onBINChanged}
              value={bin}
              id="outlined-basic"
              label="N° Tarjeta"
              placeholder="eg. 123456"
              variant="outlined"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
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
                style: { borderRadius: '8px' }, // Bordes redondeados
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
        
        <Box 
          className= 'banksContainer' 
          sx={{ 
            display: 'flex',  // Cambia display según canProceed canProceed ? 'block' : 'flex'
            justifyContent: 'center',
            flexWrap: 'wrap', 
            width: canProceed ? '1200px' : '600px',
            margin: canProceed ? '6rem auto' : '0 auto'
          }}
        >
          {bankList.map((item, index) => {
            if (item.Activo) {
              return (
                <Box 
                  key={index} 
                  className={canProceed ? 'animate__animated animate__fadeInLeft': ''}
                  sx={{
                    animationDelay: canProceed ? (index+1)/10+'s' : '0s'
                  }}
                  style={{ 
                    display: 'flex',
                    flexDirection: 'column', 
                    height: '250px', 
                    width: canProceed ? '420px' : '300px',
                    alignItems: 'center',
                    margin: '0 0 5rem 0'
                  }}
                >
                  <Box sx={{display:'flex', 
                            width:'300px', 
                            height: canProceed ? '4rem' : '300px', 
                            justifyContent:'center', 
                            alignItems:'center', 
                            backgroundColor: canProceed ? 'orange' : ''}}>
                    <img 
                      className="img-bank" 
                      style={{ width: canProceed ? '300px' : '250px', height: 'auto' }} 
                      src={canProceed ? `/assets/Banners/banner${item.Descripcion}.png` : `/assets/Cuadrados/${item.Descripcion}.png`} 
                      alt="" 
                    />
                  </Box>

                  {canProceed && (
                    <Box sx={{ width:'300px',boxShadow: '0px 4px 4px -2px rgba(0, 0, 0, 0.2)'}}>
                      <Box className="bankTitles" 
                            sx={{ display: 'flex', width:'300px', height:'3rem', backgroundColor:'#1976d2', color:'white', alignItems:'center'}}>
                        <Box sx={{width:'50%', textIndent:'1rem'}}>Plan</Box>
                        <Box sx={{width:'25%', textAlign:'center'}}>Cuotas</Box>
                        <Box sx={{width:'25%', textAlign:'center'}}>%</Box>
                      </Box>
                      {bankDiscounts.filter(desc => desc.IdTarjeta === item.IdPosnet).map((discount, idx) => (
                      <Box 
                        className="bankInfo" 
                        sx={{ 
                          display: 'flex', 
                          height: '2rem', 
                          width: '300px', 
                          alignItems: 'center',
                          borderBottom: '1px solid #ccc',  // Borde inferior en toda la fila
                          '&:last-child': {  // Opcionalmente remueve borde en la última fila
                            borderBottom: 'none',
                          }
                        }} 
                        key={idx}
                      >
                        <Box sx={{ width: '50%', backgroundColor: '#e9ebf7', textIndent: '0.5rem', lineHeight: '1.9rem' }}>
                          {discount.Descripcion}
                        </Box>
                        <Box sx={{ width: '25%', textAlign: 'center' }}>
                          {discount.Cuota}
                        </Box>
                        <Box sx={{ width: '25%', textAlign: 'center', backgroundColor: '#e9ebf7', textIndent: '0.5rem', lineHeight: '1.9rem' }}>
                          {discount.Variacion}%
                        </Box>
                      </Box>
                    ))}
                    </Box>
                  )}
                </Box>
              );
            } else {
              return null;
            }
          })}
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
      </Container>
    </>
  );
};