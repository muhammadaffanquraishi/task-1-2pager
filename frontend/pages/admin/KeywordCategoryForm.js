import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const AdminCategoryKeywordForm = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const toast = useToast();

  // Fetch categories to show in the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/admin/categories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(response.data);
      } catch (error) {
        toast({
          title: "Error fetching categories",
          description: error.response?.data?.message || "Server error",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchCategories();
  }, []);

  // Function to handle category creation
  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/admin/categories",
        { name: categoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategoryName("");
      toast({
        title: "Category added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error adding category.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Function to handle keyword addition to selected category
  const handleAddKeyword = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/admin/categories/${selectedCategory}/keywords`,
        { keyword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setKeyword("");
      toast({
        title: "Keyword added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error adding keyword.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <FormControl mb={4}>
        <FormLabel>Add New Category</FormLabel>
        <Input
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <Button mt={2} colorScheme="teal" onClick={handleAddCategory}>
          Add Category
        </Button>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Select Category to Add Keyword</FormLabel>
        <Select
          placeholder="Select category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Input
          mt={2}
          placeholder="Keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button
          mt={2}
          colorScheme="teal"
          onClick={handleAddKeyword}
          isDisabled={!selectedCategory}
        >
          Add Keyword to Category
        </Button>
      </FormControl>
    </Box>
  );
};

export default AdminCategoryKeywordForm;
