import React from 'react';
import { Box, Text, Link, Stack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.800" color="white" py={4}>
      <Stack direction={['column', 'row']} spacing={4} justify="center">
        <Link href="/privacy-policy" color="white" marginLeft="80 ">Privacy Policy</Link>
        <Link href="/terms-of-service" color="white">Terms of Service</Link>
        <Link href="/contact" color="white">Contact</Link>
      </Stack>
      <Text textAlign="center" marginLeft="80" mt={2}>© 2024 Service Booking. All rights reserved.</Text>
    </Box>
  );
};

export default Footer;