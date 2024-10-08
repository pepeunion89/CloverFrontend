import { createContext, useState } from 'react';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [initialAmount, setInitialAmount] = useState(1.00);
  const [finalAmount, setFinalAmount] = useState(initialAmount);
  const [descripcionPlan, setDescripcionPlan] = useState();
  const [cuotas, setCuotas] = useState();
  const [variacion, setVariacion] = useState();
  const [selectedBankContext, setSelectedBankContext] = useState();

  return (
    <PaymentContext.Provider value={{ paymentData, setPaymentData,
                                      initialAmount, setInitialAmount,
                                      finalAmount, setFinalAmount,
                                      descripcionPlan, setDescripcionPlan,
                                      cuotas, setCuotas,
                                      variacion, setVariacion,
                                      selectedBankContext, setSelectedBankContext      
     }}>
      {children}
    </PaymentContext.Provider>
  );
};