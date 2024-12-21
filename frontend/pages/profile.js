import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button, VStack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error loading profile",
          description: "Unable to fetch user profile.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router, toast]);

  const handleRemove = async (type, id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/profile/remove-${type}`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state to remove the item
      setUser((prevUser) => ({
        ...prevUser,
        [type]: prevUser[type].filter((item) => item._id !== id),
      }));

      toast({
        title: `${type.slice(0, -1)} removed successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(`Error removing ${type}:`, error);
      toast({
        title: `Error removing ${type.slice(0, -1)}`,
        description: "Failed to update profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box p={6}>
      <Heading mb={4}>User Profile</Heading>
      {user ? (
        <>
          <Text>
            <strong>Name:</strong> {user.name}
          </Text>
          <Text>
            <strong>Email:</strong> {user.email}
          </Text>
          <Text>
            <strong>Role:</strong> {user.role}
          </Text>

          {user.role === "professional" && (
            <>
              <Text>
                <strong>Fees:</strong>{" "}
                {user.fees ? `$${user.Hourly}/hour` : "Not set"}
              </Text>
              <Text>
                <strong>Available Hours:</strong>{" "}
                {user.availableHours || "Not set"}
              </Text>

              {/* Display services */}
              <Box mt={6}>
                <Text fontSize="lg" fontWeight="bold">
                  Services:
                </Text>
                {/* <Box height="100px" overflowY="scroll"> */}
                <VStack align="start" spacing={2}>
                  {user.services.length > 0 ? (
                    user.services.map((service) => (
                      <Box
                        key={service._id}
                        p={3}
                        borderWidth={1}
                        borderRadius="md"
                        width="100%"
                      >
                        <Text>{service.name}</Text>
                        <Button
                          mt={2}
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleRemove("services", service._id)}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))
                  ) : (
                    <Text>No services added yet.</Text>
                  )}
                </VStack>
                {/* </Box> */}
              </Box>

              {/* Display categories */}
              <Box mt={6}>
                <Text fontSize="lg" fontWeight="bold">
                  Categories:
                </Text>
                {/* <Box height="100px" overflowY="scroll"> */}
                <VStack align="start" spacing={2}>
                  {user.categories.length > 0 ? (
                    user.categories.map((category) => (
                      <Box
                        key={category._id}
                        p={3}
                        borderWidth={1}
                        borderRadius="md"
                        width="100%"
                      >
                        <Text>{category.name}</Text>
                        <Button
                          mt={2}
                          colorScheme="red"
                          size="sm"
                          onClick={() =>
                            handleRemove("categories", category._id)
                          }
                        >
                          Remove
                        </Button>
                      </Box>
                    ))
                  ) : (
                    <Text>No categories added yet.</Text>
                  )}
                </VStack>
                {/* </Box> */}
              </Box>

              {/* Display keywords */}
              <Box mt={6}>
                <Text fontSize="lg" fontWeight="bold">
                  Keywords:
                </Text>
                {/* <Box height="100px" overflowY="scroll"> */}
                <VStack align="start" spacing={2}>
                  {user.keywords.length > 0 ? (
                    user.keywords.map((keyword) => (
                      <Box
                        key={keyword._id}
                        p={3}
                        borderWidth={1}
                        borderRadius="md"
                        width="100%"
                      >
                        <Text>{keyword.keyword}</Text>
                        <Button
                          mt={2}
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleRemove("keywords", keyword._id)}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))
                  ) : (
                    <Text>No keywords added yet.</Text>
                  )}
                </VStack>
                {/* </Box> */}
              </Box>
            </>
          )}

          {/* Edit Profile Button */}
          <Button
            mt={4}
            colorScheme="teal"
            onClick={() => router.push("/userProfileForm")}
          >
            Edit Profile
          </Button>
        </>
      ) : (
        <Text>No user data found.</Text>
      )}
    </Box>
  );
};

export default Profile;
