"use client"

import { useState, useEffect } from "react"
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
import CssBaseline from '@mui/material/CssBaseline'
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

// Import Firebase
import { firestore } from "../firebase";
import { collection, getDocs, query } from "firebase/firestore";

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
  const [contacts, setContacts] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  })

  // Fetch contacts from Firebase when component mounts
  useEffect(() => {
    async function fetchContacts() {
      try {
        const contactsRef = collection(firestore, 'contacts')
        const querySnapshot = await getDocs(query(contactsRef))

        // Transform Firebase documents to match app's structure
        const contactsList = []
        let counter = 1

        querySnapshot.forEach((doc) => {
          // Get the phone number
          let phoneNumber = doc.data().phone || ""

          // Format phone for display if it's a 10-digit number
          let formattedPhone = phoneNumber
          if (phoneNumber.length === 10 && /^\d+$/.test(phoneNumber)) {
            formattedPhone = `(${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`
          }

          contactsList.push({
            id: counter.toString(),
            name: doc.id,
            phone: formattedPhone, // Formatted for display
            rawPhone: phoneNumber, // Raw for adding to contacts
            checked: true // Default checked state
          })

          counter++
        })

        setContacts(contactsList)
      } catch (error) {
        console.error("Error fetching contacts:", error)
        setSnackbar({
          open: true,
          message: "Failed to load contacts. Please try again.",
          severity: "error"
        })
      }
    }

    fetchContacts()
  }, [])

  const handleCheckboxChange = (id) => {
    setContacts(contacts.map((contact) => (
      contact.id === id ? { ...contact, checked: !contact.checked } : contact
    )))
  }

  const addToPhoneContacts = async () => {
    // Get only checked contacts
    const checkedContacts = contacts.filter(contact => contact.checked)

    if (checkedContacts.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one contact",
        severity: "warning"
      })
      return
    }

    // Check if the Contacts API is available
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const properties = ['name', 'tel']
        const opts = { multiple: true }

        // Prepare contacts in the format expected by the Contacts API
        const contactsToAdd = checkedContacts.map(contact => {
          const phoneNumber = contact.rawPhone.length === 10 ?
            `+1${contact.rawPhone}` : contact.rawPhone

          return {
            name: contact.name,
            tel: phoneNumber
          }
        })

        // Request to add contacts
        const contacts = await navigator.contacts.select(properties, opts)
        setSnackbar({
          open: true,
          message: "Contacts added successfully!",
          severity: "success"
        })

      } catch (error) {
        console.error("Error adding contacts:", error)
        setSnackbar({
          open: true,
          message: "Error adding contacts: " + (error.message || "Please try again"),
          severity: "error"
        })

      }
    } else {
      // Fallback for browsers that don't support the Contacts API
      try {
        // Process each contact one by one
        for (const contact of checkedContacts) {
          // Create a contact object
          const newContact = {
            name: contact.name,
            tel: contact.rawPhone.length === 10 ? `+1${contact.rawPhone}` : contact.rawPhone
          }

          // Create a virtual anchor element to trigger the download
          const vCard = createVCard(newContact)
          const blob = new Blob([vCard], { type: 'text/vcard' })
          const url = window.URL.createObjectURL(blob)

          const a = document.createElement('a')
          a.href = url
          a.download = `${contact.name}.vcf`
          document.body.appendChild(a)
          a.click()

          // Clean up
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }

        setSnackbar({
          open: true,
          message: "Contact files created. Please save them to add to your contacts.",
          severity: "success"
        })

      } catch (error) {
        console.error("Error creating contact files:", error)
        setSnackbar({
          open: true,
          message: "Error creating contact files: " + (error.message || "Please try again"),
          severity: "error"
        })

      }
    }
  }

  // Helper function to create a vCard format for contacts
  const createVCard = (contact) => {
    return `BEGIN:VCARD
 VERSION:3.0
 FN:${contact.name}
 TEL;TYPE=CELL:${contact.tel}
 END:VCARD`
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">Important Contacts</Typography>

        {contacts.length === 0 ? (
          <Typography align="center" sx={{ mt: 2 }}>No contacts found</Typography>
        ) : (
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
        )}

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddCircleIcon />}
            onClick={addToPhoneContacts}
          >
            Add to Contacts
          </Button>
        </Box>

        {/* Snackbar for displaying messages */}
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{
                vertical: 'bottom', 
                horizontal: 'center', 
            }}
        >
        <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
        >
        {snackbar.message}
        </Alert>
        </Snackbar>

      </Container>
    </ThemeProvider>
  )
}
