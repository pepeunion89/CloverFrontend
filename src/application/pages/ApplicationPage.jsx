import ApplicationLayout from "../layout/ApplicationLayout"
import { SearchSection } from "../components"
import { Box, Container } from '@mui/material';
import { PaymentProvider } from '../components/PaymentContext';
import 'animate.css';

export const ApplicationPage = () => {
  return (
    <>
      <ApplicationLayout>
        <Box sx={{display: 'flex', justifyContent:'space-around'}}>
          <PaymentProvider>
            <Container sx={{display:'flex'}}>
              <SearchSection className='SearchTag'/>
            </Container>
          </PaymentProvider>
        </Box>    
      </ApplicationLayout>
    </>
  )
}