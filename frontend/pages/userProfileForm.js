import React, { useState, useEffect } from "react";
import {
  Box,
  Select,
  Input,
  Textarea,
  Button,
  useToast,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UserProfileForm = () => {
  const [userRole, setUserRole] = useState(""); // Track user role
  const [personalDetails, setPersonalDetails] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Add email state
  const [password, setPassword] = useState(""); // Add password state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password
  const [categories, setCategories] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableKeywords, setAvailableKeywords] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableHours, setAvailableHours] = useState("");
  const [fees, setFees] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(response.data.role);
        setPersonalDetails(response.data.personalDetails || "");
        // setSelectedDates(
        //   response.data.unavailableDates?.map((date) => new Date(date)) || []
        // );
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchOptions = async () => {
      try {
        const [categoryResponse, keywordResponse, serviceResponse] =
          await Promise.all([
            axios.get("http://localhost:5000/api/categories"),
            axios.get("http://localhost:5000/api/keywords"),
            axios.get("http://localhost:5000/api/services"),
          ]);

        setAvailableCategories(categoryResponse.data);
        setAvailableKeywords(keywordResponse.data);
        setAvailableServices(serviceResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    const fetchUnavailableDates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/professionals/unavailable-dates",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSelectedDates(response.data.unavailableDates); // Assume backend returns an array of unavailable dates
      } catch (error) {
        toast({
          title: "Error fetching unavailable dates",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUnavailableDates();
    fetchUserData();
    fetchOptions();
  }, [toast]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Simple regex for email validation

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    if (email && !isValidEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const payload = {};
      let changesMade = false;
  
      if (personalDetails) payload.personalDetails = personalDetails;
      if (name) payload.name = name.trim();
      if (email) payload.email = email.trim();
      if (password.trim()) payload.password = password;
      if (availableHours) payload.availableHours = availableHours;
      if (fees) payload.fees = fees;
  
      if (Object.keys(payload).length > 0) {
        await axios.put("http://localhost:5000/api/profile/update", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        changesMade = true;
      }
  
      if (userRole === "professional") {
        // Save selected unavailable dates
        if (selectedDates.length > 0) {
          await axios.post(
            "http://localhost:5000/api/professionals/unavailability",
            { unavailableDates: selectedDates },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          changesMade = true;
        }
  
        if (selectedService) {
          await axios.put(
            "http://localhost:5000/api/profile/append-services",
            { services: [selectedService] },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          changesMade = true;
        }
  
        if (selectedCategory) {
          await axios.put(
            "http://localhost:5000/api/categories/profile/append-categories",
            { categories: [selectedCategory] },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          changesMade = true;
        }
  
        if (selectedKeyword) {
          await axios.put(
            "http://localhost:5000/api/keywords/profile/append-keywords",
            { keywords: [selectedKeyword] },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          changesMade = true;
        }
      
      }
  
      if (changesMade) {
        toast({
          title: "Profile updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "No changes detected",
          description:
            "Please modify at least one field to update your profile.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.response?.data?.message || "Server error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Box p={4}>
      <Input
        placeholder="Name"
        mt={4}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Email"
        type="email"
        mt={4}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="New Password"
        mt={4}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        placeholder="Confirm Password"
        mt={4}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Textarea
        placeholder="Personal Details"
        mt={4}
        value={personalDetails}
        onChange={(e) => setPersonalDetails(e.target.value)}
      />

      {userRole === "professional" && (
        <>
          <Select
            placeholder="Select Service"
            mt={4}
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            {availableServices.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </Select>

          <Select
            placeholder="Select Category"
            mt={4}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {availableCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>

          <Select
            placeholder="Select Keyword"
            mt={4}
            value={selectedKeyword}
            onChange={(e) => setSelectedKeyword(e.target.value)}
          >
            {availableKeywords.map((keyword) => (
              <option key={keyword._id} value={keyword._id}>
                {keyword.keyword}
              </option>
            ))}
          </Select>

          <Input
            placeholder="Available Work Hours Per Day"
            mt={4}
            value={availableHours}
            onChange={(e) => setAvailableHours(e.target.value)}
            type="number"
          />

        <Input
            placeholder="Hourly Price"
            mt={4}
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            type="number"
          />

          <Box p={4}>
            <Heading>Select Unavailable Dates</Heading>
            <DatePicker
              selected={null}
              onChange={(date) =>
                setSelectedDates(
                  (prevDates) =>
                    prevDates.some(
                      (unavailableDate) =>
                        new Date(unavailableDate).toDateString() ===
                        date.toDateString()
                    )
                      ? prevDates.filter(
                          (unavailableDate) =>
                            new Date(unavailableDate).toDateString() !==
                            date.toDateString()
                        ) // Remove date if it's already selected
                      : [...prevDates, date] // Add date if it's not selected
                )
              }
              inline
              highlightDates={selectedDates.map((date) => new Date(date))}
            />
          </Box>
        </>
      )}

      <Button mt={4} colorScheme="teal" onClick={handleSubmit}>
        Update Profile
      </Button>
    </Box>
  );
};

export default UserProfileForm;
