import React from 'react';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import Header from './../components/header';
import Footer from './../components/footer';
import Sidebar from './../components/sidebar';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Header />
      <Flex>
        <Sidebar />
        <Box flex="1" p={4}>
          <Component {...pageProps} />
        </Box>
      </Flex>
      <Footer />
    </ChakraProvider>
  );
}

export default MyApp;