import { Box } from '@mui/material';

export const BanksContainer = ({canProceed, setBankSelected, setShowSaleForm, bankDiscounts, bankList}) => {


const getBankSelected = (IdPosnet)=>{

    setShowSaleForm(true);

    setBankSelected(IdPosnet);

    console.log(IdPosnet);

  }

  return (
    <>
        <Box 
          className= 'banksContainer' 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap', 
            width: canProceed ? '1200px' : '600px',
            margin: canProceed ? '6rem auto' : '0 auto',
          }}>
          {bankList.map((item, index) => {
            if (item.Activo) {
              console.log(item);
              return (
                <Box 
                  key={index} 
                  className={canProceed ? 'animate__animated animate__fadeInLeft': 'animate__animated animate__flipInY'}
                  sx={{
                    animationDelay: (index+1)/10+'s',
                    animationDuration: '1.5s'
                  }}
                  style={{ 
                    display: 'flex',
                    flexDirection: 'column', 
                    height: canProceed ? 'auto' : '250px', 
                    width: canProceed ? '410px' : '300px',
                    alignItems: 'center',
                    margin: '0 0 3rem 0'
                  }}
                >
                  <Box className='shadowBox-container'
                        onClick={() => getBankSelected(item.IdPosnet)}
                        sx={{boxShadow: canProceed ? '0 0 5px black' : '',
                            cursor: canProceed ? 'pointer' : '',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transición suave para transform y box-shadow
                            '&:hover': {
                              transform: canProceed ? 'scale(1.05)' : 'none', // Zoom al pasar el cursor
                              boxShadow: canProceed ? '0 0 20px black' : '', // Sombra más pronunciada en hover
                            }
                            
                        }}>
                    <Box sx={{display:'flex', 
                              width:'300px', 
                              height: canProceed ? 'auto' : '300px', 
                              justifyContent:'center', 
                              alignItems:'center', 
                              backgroundColor: canProceed ? 'orange' : '',
                              transition: 'transform 0.3s ease', // Transición suave para el cambio de tamaño
                              }}>
                      <img 
                        className="img-bank" 
                        style={{ width: canProceed ? '300px' : '250px', 
                                  height: 'auto', 
                                  transition: 'width 0.3s ease',
                                  borderRadius: canProceed ? '' : '10px'// Transición para el cambio de tamaño de la imagen
                        }} 
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
                            {discount.Banco}
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
                </Box>
              );
            } else {
              return null;
            }
          })}
        </Box>
    </>
  )
}
