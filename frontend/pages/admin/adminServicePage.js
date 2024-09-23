import React, { useState, useEffect } from "react";
import { Box, Input, Button, Select, Text, useToast } from "@chakra-ui/react";
import axios from "axios";

const AdminServicePage = () => {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [provider, setProvider] = useState("");
  const toast = useToast();

  // Fetch all services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/services"); // Change this if you have a different service fetch route
        setServices(response.data);
      } catch (error) {
        toast({
          title: "Error fetching services",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchServices();
  }, [toast]);

  // Handle adding a new service
  const handleAddService = async () => {
    const token = localStorage.getItem("token");
    try {
      console.log("ADDING SERVICE")
      const response = await axios.post(
        "http://localhost:5000/api/admin/services",
        {
          name,
          description,
          price,
          provider,
        },
        {
          headers:{Authorization:`Bearer ${token}`}
        }
      );

      setServices([...services, response.data]); // Add the new service to the state
      toast({
        title: "Service added successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Clear inputs after submission
      setName("");
      setDescription("");
      setPrice("");
      setProvider("");
    } catch (error) {
      console.log(error)
      console.log("SERVICES ADDING")
      toast({
        title: "Error adding service",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle removing a service
  const handleRemoveService = async (serviceId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/services/${serviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setServices(services.filter((service) => service._id !== serviceId)); // Remove the service from state
      toast({
        title: "Service removed successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error removing service",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>
        Manage Services
      </Text>

      {/* Form to add a new service */}
      <Box mb={6}>
        <Input
          placeholder="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Service Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Service Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          mb={2}
        />
        <Button colorScheme="teal" onClick={handleAddService}>
          Add Service
        </Button>
      </Box>

      {/* List of services with a remove button */}
      <Box>
        {services.length > 0 ? (
          services.map((service) => (
            <Box
              key={service._id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              mb={4}
            >
              <Text fontSize="lg">{service.name}</Text>
              <Text>{service.description}</Text>
              <Text>${service.price}</Text>
              <Button
                mt={2}
                colorScheme="red"
                onClick={() => handleRemoveService(service._id)}
              >
                Remove Service
              </Button>
            </Box>
          ))
        ) : (
          <Text>No services found.</Text>
        )}
      </Box>
    </Box>
  );
};

export default AdminServicePage;
