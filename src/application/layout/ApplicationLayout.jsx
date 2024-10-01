import { Box } from "@mui/material";
import { NavBar } from "../components";



const ApplicationLayout = ({children}) => {
  return (
    <Box className='ApplicationLayout' sx={{padding:'0px'}}>
        <NavBar />
        <Box className='AL-Container' >
          {children}
        </Box>
    </Box>
  )
}

export default ApplicationLayout