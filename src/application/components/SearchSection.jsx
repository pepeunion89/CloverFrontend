import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { BINsearch, BanksContainer, PaymentForm } from './';

export const SearchSection = () => {  
  const [canProceed, setCanProceed] = useState(false);
  const [bankDiscounts, setBankDiscounts] = useState([]); // Estado para los descuentos
  const [loadingBankList, setLoadingBankList] = useState(true); // Loading SQL para lista de bancos
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [bankSelected, setBankSelected] = useState();
  const [bin, setBin] = useState('');
  const [bankList, setBankList] = useState([]); // Estado para la lista de bancos
 
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
        <BINsearch canProceed={canProceed} 
                    setCanProceed={setCanProceed} 
                    bankDiscounts={bankDiscounts} 
                    setBankDiscounts={setBankDiscounts} 
                    binValue={bin} 
                    setBinValue={setBin}/>        
        <BanksContainer canProceed={canProceed} 
                        setLoadingBankList={setLoadingBankList} 
                        setBankSelected={setBankSelected} 
                        setShowSaleForm={setShowSaleForm} 
                        bankDiscounts={bankDiscounts} 
                        bankList={bankList}/>
        <PaymentForm bankDiscounts={bankDiscounts} 
                      bankSelected={bankSelected} 
                      showSaleForm={showSaleForm}/>        
      </Box>
    </>
  );
};