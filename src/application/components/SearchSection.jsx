import { Box } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { BINsearch, BanksContainer, DemoParametersPayment, PaymentForm } from './';
import { PaymentContext } from './PaymentContext';

export const SearchSection = () => {  
  const [canProceed, setCanProceed] = useState(false);
  const [bankDiscounts, setBankDiscounts] = useState([]); // Estado para los descuentos
  const [loadingBankList, setLoadingBankList] = useState(true); // Loading SQL para lista de bancos
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [bankSelected, setBankSelected] = useState();
  const [bin, setBin] = useState('');
  const [bankList, setBankList] = useState([]); // Estado para la lista de bancos

     //LAS BOOLEANAS PARA MOSTRAR LOS COMPONENTES
  const [boolDemo, setBoolDemo] = useState(true);
  const [boolBINSearch, setBoolBINSearch] = useState(false);
  const [boolPaymentForm, setBoolPaymentForm] = useState(false);

 
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
        console.log(result);
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
 
  return (
    <>
      <Box className="Search-container" sx={{ p: 0, margin:'0 auto'}}>
        {boolDemo ? <DemoParametersPayment setBoolDemo={setBoolDemo} setBoolBINSearch={setBoolBINSearch} bankList={bankList}/> : ''}
        {boolBINSearch ? <BINsearch setBoolBINSearch={setBoolBINSearch} setBoolPaymentForm={setBoolPaymentForm}
                    canProceed={canProceed} 
                    setCanProceed={setCanProceed} 
                    bankDiscounts={bankDiscounts} 
                    setBankDiscounts={setBankDiscounts} 
                    binValue={bin} 
                    setBinValue={setBin}/> : ''}        
        {boolBINSearch ? <BanksContainer canProceed={canProceed} 
                        setLoadingBankList={setLoadingBankList} 
                        setBankSelected={setBankSelected} 
                        setShowSaleForm={setShowSaleForm} 
                        bankDiscounts={bankDiscounts} 
                        bankList={bankList}/> : ''}
        {boolPaymentForm ? <PaymentForm bankDiscounts={bankDiscounts} 
                      bankSelected={bankSelected} 
                      showSaleForm={showSaleForm}
                      bankList={bankList}/> : ''}       
      </Box>
    </>
  );
};