import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Textarea, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';

const PersonalDetailsForm = () => {
  const [personalDetails, setPersonalDetails] = useState('');
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/personal-details', {
        personalDetails,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: 'Details updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/dashboard');  // Redirect to the dashboard
    } catch (error) {
      toast({
        title: 'Error updating details.',
        description: error.response?.data?.message || 'Server error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} bg="gray.100" borderRadius="md" boxShadow="md">
      <FormControl id="personalDetails" mb={4}>
        <FormLabel>Personal Details</FormLabel>
        <Textarea
          value={personalDetails}
          onChange={(e) => setPersonalDetails(e.target.value)}
        />
      </FormControl>

      <Button type="submit" colorScheme="teal">Submit Details</Button>
    </Box>
  );
};

export default PersonalDetailsForm;