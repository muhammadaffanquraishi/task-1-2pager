import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormDataProvider } from '../context/FormDataContext';

function MyApp({ Component, pageProps }) {
  return (
    <FormDataProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </FormDataProvider>
  );
}

export default MyApp;
