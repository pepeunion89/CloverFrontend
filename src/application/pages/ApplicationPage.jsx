import ApplicationLayout from "../layout/ApplicationLayout"
import { ResultsSection, SearchSection } from "../components"
import { Box } from '@mui/material';

export const ApplicationPage = () => {
  return (
    <>
      <ApplicationLayout>
        <Box sx={{display: 'flex', justifyContent:'space-around'}}>
          <SearchSection />
          <ResultsSection />
        </Box>
        {/*</JournalLayout></Typography>*/}        
      </ApplicationLayout>
    </>
  )
}