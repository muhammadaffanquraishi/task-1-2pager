import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Make the login request
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
  
      if (response.status === 200) {
        toast({
          title: 'Login successful.',
          description: "You've successfully logged in.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Store the token in local storage
        const token = response.data.token;
        localStorage.setItem('token', token);

        // Fetch user details (role) using the token
        const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Check the user's role and redirect accordingly
        const userRole = userResponse.data.role;
        if (userRole === 'admin') {
          router.push('/admin/dashboard');  // Redirect to admin dashboard
        } else {
          router.push('/dashboard');  // Redirect to normal dashboard
        }
      }
    } catch (error) {
      // If the error is from the server, display the message
      if (error.response && error.response.data.message) {
        toast({
          title: 'Login failed.',
          description: error.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Login failed.',
          description: 'An error occurred. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box minH="100vh" display="flex" justifyContent="center" alignItems="center" bg="gray.50">
      <Box 
        p={8} 
        maxW="md" 
        borderWidth={1} 
        borderRadius="lg" 
        boxShadow="lg" 
        bg="white"
      >
        <VStack spacing={4}>
          <Heading as="h1" size="lg" mb={6} textAlign="center">
            Login to Your Account
          </Heading>

          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                width="full"
              >
                Login
              </Button>
            </VStack>
          </form>

          <Text fontSize="sm" color="gray.600">
            Don't have an account? <a href="/register" style={{ color: 'teal.500' }}>Sign up</a>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginPage;