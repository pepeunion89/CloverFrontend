import { Box } from "@mui/material";
import { NavBar } from "../components";



const ApplicationLayout = ({children}) => {
  return (
    <Box sx={{display: 'flex'}}>
        <NavBar />
        <Box component='main' sx={{flexGrow: 1, p:3, mt:7}} >
          {children}
        </Box>
    </Box>
  )
}

export default ApplicationLayout