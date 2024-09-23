import React, { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, Select, Button } from '@chakra-ui/react';
import axios from 'axios';

const ProfessionalProfileForm = () => {
  const [categories, setCategories] = useState([]);   // Categories fetched from the backend
  const [keywords, setKeywords] = useState([]);       // Keywords fetched from the backend
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories
  const [selectedKeywords, setSelectedKeywords] = useState([]);     // Selected keywords

  // Fetch categories and keywords from the backend when the component mounts
  useEffect(() => {
    const fetchCategoriesAndKeywords = async () => {
      try {
        const categoriesRes = await axios.get('http://localhost:5000/api/categories');
        const keywordsRes = await axios.get('http://localhost:5000/api/keywords');
        setCategories(categoriesRes.data);
        setKeywords(keywordsRes.data);
      } catch (error) {
        console.error('Error fetching categories and keywords:', error);
      }
    };
    fetchCategoriesAndKeywords();
  }, []);

  // Handle form submission
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      // Send selected categories and keywords to the backend
      await axios.put('http://localhost:5000/api/profile/professional', {
        categories: selectedCategories,
        keywords: selectedKeywords,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Box as="form" onSubmit={handleProfileUpdate}>
      {/* Category Selection */}
      <FormControl>
        <FormLabel>Select Categories</FormLabel>
        <Select
          placeholder="Select categories"
          multiple
          onChange={(e) => setSelectedCategories([...e.target.selectedOptions].map(opt => opt.value))}
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl>

      {/* Keyword Selection */}
      <FormControl mt={4}>
        <FormLabel>Select Keywords</FormLabel>
        <Select
          placeholder="Select keywords"
          multiple
          onChange={(e) => setSelectedKeywords([...e.target.selectedOptions].map(opt => opt.value))}
        >
          {keywords.map((keyword) => (
            <option key={keyword._id} value={keyword._id}>
              {keyword.keyword}
            </option>
          ))}
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Button mt={4} type="submit" colorScheme="teal">
        Update Profile
      </Button>
    </Box>
  );
};

export default ProfessionalProfileForm;