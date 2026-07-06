'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0052CC', // Royal Blue
      light: '#3884FF',
      dark: '#003E99',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6B778C', // Cool Slate Neutral
      light: '#97A0AF',
      dark: '#42526E',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F5F7', // Cool light grey layout background
      paper: '#FFFFFF', // Clean white card background
    },
    text: {
      primary: '#091E42', // Deep navy/almost black for text
      secondary: '#5E6C84', // Slate grey for labels and description
      disabled: '#A5ADBA',
    },
    success: {
      main: '#006644', // Dark green text
      light: '#E3FCEF', // Soft green background
      dark: '#004d33',
    },
    warning: {
      main: '#FF8B00', // Amber/orange text
      light: '#FFEAD5', // Soft orange background
      dark: '#B76E00',
    },
    info: {
      main: '#0747A6', // Soft dark blue text
      light: '#DEEBFF', // Soft blue background
      dark: '#002C66',
    },
    error: {
      main: '#DE350B', // Bright alert red text
      light: '#FFEBE6', // Soft red background
      dark: '#BF2600',
    },
    divider: '#DFE1E6', // Standard line separator
    sidebar: {
      background: '#091E42', // Deep dark navy sidebar
      text: '#8993A4', // Slate sidebar text
      activeText: '#FFFFFF', // High-contrast white active text
      activeBackground: '#0052CC', // Active row highlight
      hoverBackground: 'rgba(255, 255, 255, 0.08)', // Subtle hover highlight
      border: 'rgba(255, 255, 255, 0.08)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#091E42',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      color: '#091E42',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      color: '#091E42',
    },
    h4: {
      fontWeight: 600,
      color: '#091E42',
    },
    h5: {
      fontWeight: 600,
      color: '#091E42',
    },
    h6: {
      fontWeight: 600,
      color: '#091E42',
    },
    body1: {
      color: '#172B4D',
      fontSize: '0.925rem',
      lineHeight: 1.5,
    },
    body2: {
      color: '#5E6C84',
      fontSize: '0.85rem',
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // Standard 8px border radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          boxShadow: 'none',
          padding: '6px 16px',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#0052CC',
          '&:hover': {
            backgroundColor: '#004099',
          },
        },
        outlinedPrimary: {
          borderColor: '#0052CC',
          '&:hover': {
            borderColor: '#004099',
            backgroundColor: 'rgba(0, 82, 204, 0.04)',
          },
        },
        outlinedSecondary: {
          borderColor: '#DFE1E6',
          color: '#091E42',
          '&:hover': {
            borderColor: '#C1C7D0',
            backgroundColor: '#F4F5F7',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #DFE1E6',
          borderRadius: 8,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#091E42',
          borderBottom: '1px solid #DFE1E6',
          boxShadow: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #DFE1E6',
          padding: '12px 16px',
          color: '#172B4D',
        },
        head: {
          backgroundColor: '#F4F5F7',
          color: '#5E6C84',
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          padding: '10px 16px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          borderBottom: '2px solid #DFE1E6',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#DFE1E6',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#A5ADBA',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0052CC',
            borderWidth: '2px',
          },
        },
        input: {
          padding: '10px 14px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '12px 16px',
          color: '#5E6C84',
          '&.Mui-selected': {
            color: '#0052CC',
          },
        },
      },
    },
  },
});

export default theme;
