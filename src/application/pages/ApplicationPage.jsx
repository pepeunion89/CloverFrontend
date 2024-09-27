import ApplicationLayout from "../layout/ApplicationLayout"
import { ResultsSection, SearchSection } from "../components"
import { Box, Container } from '@mui/material';
import { PaymentProvider } from '../components/PaymentContext';
import 'animate.css';

export const ApplicationPage = () => {
  return (
    <>
      <ApplicationLayout>
        <Box sx={{display: 'flex', justifyContent:'space-around'}}>
          <PaymentProvider>
            <Container sx={{display:'flex', mt:'5rem'}}>
              <SearchSection className='SearchTag'/>
              <ResultsSection className='ResultsTag'/>
            </Container>
          </PaymentProvider>
        </Box>    
      </ApplicationLayout>
    </>
  )
}