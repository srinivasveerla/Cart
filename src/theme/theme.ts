import { createTheme, Theme } from "@mui/material/styles";

const darkKhaki: string = '#7f7711';

const theme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: darkKhaki,
      contrastText: '#fff',
    },
  },
});

export default theme;
