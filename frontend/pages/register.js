import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Text,
  Select,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Default to "user" role
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Registration failed.",
        description: "Passwords do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password, role }
      );

      if (response.status === 201) {
        toast({
          title: "Registration successful.",
          description: "You've successfully registered.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        router.push("/login"); // Redirect to login page after registration
      } else {
        toast({
          title: "Registration failed.",
          description: response.data.message || "An error occurred. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to register. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      // bg="gray.50"
    >
      <Box
        p={8}
        maxW="md"
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        // bg="white"
      >
        <VStack spacing={4}>
          <Heading as="h1" size="lg" mb={6} textAlign="center">
            Create an Account
          </Heading>

          <form onSubmit={handleRegister}>
            <VStack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

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

              <FormControl id="confirmPassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormControl>

              <FormControl id="role" isRequired>
                <FormLabel>Register As</FormLabel>
                <Select
                  placeholder="Select role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="professional">Professional</option>
                </Select>
              </FormControl>

              <Button type="submit" colorScheme="teal" size="lg" width="full">
                Register
              </Button>
            </VStack>
          </form>
          <Text fontSize="sm">
            Already have an account?{" "}
            <a href="/login" style={{ color: "teal.500" }}>
              Sign in
            </a>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default RegisterPage;
