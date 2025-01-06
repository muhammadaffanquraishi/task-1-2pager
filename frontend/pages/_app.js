import React, { useEffect, useState } from "react";
import { ChakraProvider, Box, Flex } from "@chakra-ui/react";
import Header from "./../components/header";
import Footer from "./../components/footer";
import Sidebar from "./../components/sidebar";
import axios from "axios";

function MyApp({ Component, pageProps }) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/auth/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setRole(response.data.role);
        } catch {
          setRole(null); // Reset role on error (e.g., token invalid)
        }
      } else {
        setRole(null); // No token, no role
      }
    };

    fetchUserRole();
  }, []);

  return (
    <ChakraProvider>
      <Flex direction="column" minHeight="100vh">
        <Header role={role} />
        <Flex flex="1">
          <Sidebar role={role} /> {/* Pass role to Sidebar */}
          <Box flex="1" marginTop="4rem" marginLeft="80" p={4}>
            <Component {...pageProps} />
          </Box>
        </Flex>
        <Footer />
      </Flex>
    </ChakraProvider>
  );
}

export default MyApp;
