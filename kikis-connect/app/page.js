"use client"

import { useState } from "react"
import Box from "@mui/material/Box"
import Checkbox from "@mui/material/Checkbox"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import Container from "@mui/material/Container"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from '@mui/material/CssBaseline';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#f50057",
    },
  },
})

export default function ContactsPage() {
  const [contacts, setContacts] = useState([
    { id: "1", name: "Office of Student Housing", phone: "(415) 422-6824", checked: true },
    { id: "2", name: "USF Public Safety", phone: "(415) 422-2911", checked: true },
    { id: "3", name: "Title IX Coordinator", phone: "(415) 422-4563", checked: true },
    { id: "4", name: "Office of the Dean of Students", phone: "(415) 422-5330", checked: true },
    { id: "5", name: "Office of Undergraduate Admission", phone: "(415) 422-6563", checked: true },
    { id: "6", name: "Alumni", phone: "(415) 422-6431", checked: true },
  ])
  
  const handleCheckboxChange = (id) => {
    setContacts(contacts.map((contact) => (contact.id === id ? { ...contact, checked: !contact.checked } : contact)))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h5" align="center">Important Contacts</Typography>
            <List>
              {contacts.map((contact) => (
                <ListItem onClick={() => handleCheckboxChange(contact.id)} key={contact.id}>
                  <ListItemIcon>
                    <Checkbox edge="start" checked={contact.checked} tabIndex={-1} disableRipple />
                  </ListItemIcon>
                  <ListItemText primary={contact.name} secondary={contact.phone} />  
                </ListItem>
              ))}
            </List>
    
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AddCircleIcon />}
                // onClick={addToPhoneContacts}
              >
                Add to Contacts
              </Button>
            </Box>
      </Container>
    </ThemeProvider>
  );
}

