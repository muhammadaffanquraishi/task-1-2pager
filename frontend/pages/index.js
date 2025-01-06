import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  Stack,
  SimpleGrid,
  Text,
  Icon,
  useToast, // Import useToast from Chakra UI
} from "@chakra-ui/react";
import { FaCode, FaPencilAlt, FaLaptop, FaMobileAlt } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/router";

const ServiceCard = ({ icon, title, description }) => (
  <Box
    p={5}
    borderWidth={1}
    borderRadius="lg"
    textAlign="center"
    boxShadow="md"
    _hover={{ boxShadow: "xl", transform: "scale(1.05)" }}
    transition="all 0.3s ease"
  >
    <Icon as={icon} boxSize={5} mb={4} color="teal.500" />
    <Heading size="md" mb={2}>
      {title}
    </Heading>
    <Text color="gray.600">{description}</Text>
  </Box>
);

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [professionals, setProfessionals] = useState([]);
  const [keyword, setKeyword] = useState(""); // Add keyword state for input
  const router = useRouter();
  const toast = useToast(); // Initialize useToast

  // Function to handle search by keyword
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/search`, {
        params: { searchTerm: keyword },
      });
      const results = response.data;

      if (results.length === 0) {
        // Show toast if no professionals found
        toast({
          title: "No Results Found",
          description: `No professionals found for "${keyword}". Please try a different keyword.`,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Update state with the search results
        setProfessionals(results);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `No professionals found for "${keyword}". Please try a different keyword.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents adding a new line
      handleSearch();
    }
  };
  

  if (!isAuthenticated) {
    return null; // Return null while checking authentication
  }

  return (
    <Box p={4}>
      {/* Search Bar */}
      <Flex justify="center">
        <Input
          placeholder="Search for services, professionals..."
          size="lg"
          width="50%"
          borderRadius="full"
          boxShadow="md"
          mr={2}
          value={keyword} // Controlled input
          onChange={(e) => setKeyword(e.target.value)} // Update keyword state
          onKeyDown={handleKeyDown} 
        />
        <Button
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          onClick={handleSearch}  
        >
          Search
        </Button>
      </Flex>

      {/* Search Results Section */}
      {professionals.length > 0 && (
        <Box mt={10}>
          <Heading size="lg" mb={5}>
            Search Results
          </Heading>
          {professionals.map((professional) => (
            <Box
              key={professional._id}
              p={5}
              borderWidth={1}
              borderRadius="lg"
              mb={4}
            >
              <Heading size="md">{professional.name}</Heading>
              <Text>Email: {professional.email}</Text>
              <Text>
                Categories:{" "}
                {professional.categories.map((cat) => cat.name).join(", ")}
              </Text>
              <Text>
                Keywords:{" "}
                {professional.keywords.map((kw) => kw.keyword).join(", ")}
              </Text>

              {/* Buttons for View Profile and Hire */}
              <Flex mt={4} gap={4}>
                <Button
                  colorScheme="teal"
                  onClick={() =>
                    router.push(`/professionalProfile/${professional._id}`)
                  }
                >
                  View Profile
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() =>
                    router.push(
                      `/bookingForm?professionalId=${professional._id}`
                    )
                  }
                >
                  Hire
                </Button>
              </Flex>
            </Box>
          ))}
        </Box>
      )}

      {/* Featured Categories */}
      <Box mt={10}>
        <Heading size="lg" mb={5}>
          Featured Categories
        </Heading>
        <SimpleGrid columns={[1, null, 2, 3]} spacing={10}>
          <ServiceCard
            icon={FaCode}
            title="Web Development"
            description="Custom web development services tailored to your business needs."
          />
          <ServiceCard
            icon={FaMobileAlt}
            title="Mobile App Development"
            description="Design and develop mobile apps for Android and iOS platforms."
          />
          <ServiceCard
            icon={FaLaptop}
            title="UI/UX Design"
            description="Create intuitive and engaging user interfaces for your applications."
          />
        </SimpleGrid>
      </Box>

      {/* Additional Sections */}
      <Box mt={10}>
        <Heading size="lg" mb={5}>
          Why Choose Us?
        </Heading>
        <Stack spacing={4}>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            auctor justo quis augue fermentum, at sollicitudin quam facilisis.
            Duis vehicula nisl quis nisi bibendum, nec convallis mi malesuada.
            Fusce nec odio turpis. Nullam vehicula, lorem ut scelerisque
            posuere, sapien sem luctus mauris, vitae malesuada ex arcu ac est.
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;
