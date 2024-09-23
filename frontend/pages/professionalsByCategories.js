import React, { useState, useEffect } from 'react';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import axios from 'axios';

const ProfessionalsByCategory = ({ categoryId }) => {
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    const fetchProfessionalsByCategory = async () => {
      const response = await axios.get(`http://localhost:5000/api/professionals/by-category`, {
        params: { categoryId },
      });
      setProfessionals(response.data);
    };
    fetchProfessionalsByCategory();
  }, [categoryId]);

  return (
    <Box p={4}>
      <Heading size="lg" mb={5}>Professionals in Category</Heading>
      {professionals.length > 0 ? (
        <SimpleGrid columns={[1, null, 2, 3]} spacing={10}>
          {professionals.map((professional) => (
            <Box key={professional._id} p={5} borderWidth={1} borderRadius="lg" mb={4}>
              <Heading size="md">{professional.name}</Heading>
              <Text>Email: {professional.email}</Text>
              <Text>Categories: {professional.categories.map(cat => cat.name).join(', ')}</Text>
              <Text>Keywords: {professional.keywords.map(kw => kw.keyword).join(', ')}</Text>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text>No professionals found in this category.</Text>
      )}
    </Box>
  );
};

export default ProfessionalsByCategory;