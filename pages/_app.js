import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormProvider } from '../src/context/FormContext';

function MyApp({ Component, pageProps }) {
  return (
    <FormProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </FormProvider>
  );
}

export default MyApp;
