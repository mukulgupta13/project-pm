import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import { useMaterialUIController } from "context";
import store from './store'
import SignIn from "layouts/authentication/sign-in";

export default function PublicApp() {
  const [controller] = useMaterialUIController();
  const {
    darkMode,
  } = controller;

  return <Provider store={store}>
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <SignIn />
    </ThemeProvider>
  </Provider>;
}
