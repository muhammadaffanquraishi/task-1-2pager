import React from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import withAuth from './../pages/utils/withAuth';

const Contact = () => {
  return (
    <Box p={4} maxW="600px" mx="auto">
      <Heading as="h1" size="2xl" mb={8} textAlign="center">
        Contact Us
      </Heading>

      <Text fontSize="lg" mb={8} textAlign="center">
        We would love to hear from you! Whether you have a question about our
        services, pricing, need a demo, or anything else, our team is ready to
        answer all your questions.
      </Text>

      <Stack spacing={6}>
        <FormControl id="name" isRequired>
          <FormLabel>Your Name</FormLabel>
          <Input placeholder="Enter your name" />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Your Email</FormLabel>
          <Input type="email" placeholder="Enter your email" />
        </FormControl>

        <FormControl id="message" isRequired>
          <FormLabel>Your Message</FormLabel>
          <Textarea placeholder="Enter your message" rows={6} />
        </FormControl>

        <Button colorScheme="teal" size="lg" type="submit">
          Send Message
        </Button>
      </Stack>
    </Box>
  );
};

export default withAuth(Contact);
