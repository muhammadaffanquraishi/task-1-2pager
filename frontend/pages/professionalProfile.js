import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";

const ProfessionalProfile = () => {
  const [professional, setProfessional] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [canWriteReview, setCanWriteReview] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { id: professionalId } = router.query;

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/professionals/${professionalId}`
        );
        setProfessional(response.data);
        setUnavailableDates(
          response.data.unavailableDates?.map((date) => new Date(date)) || []
        );
      } catch (error) {
        console.error("Error fetching professional:", error);
        toast({
          title: "Error",
          description: "Unable to load professional details.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/${professionalId}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast({
          title: "Error",
          description: "Unable to load reviews.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    const checkEligibility = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/bookings/eligibility/${professionalId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCanWriteReview(response.data.eligible);
      } catch (error) {
        console.error("Error checking review eligibility:", error);
      }
    };

    fetchProfessional();
    fetchReviews();
    checkEligibility();
  }, [professionalId]);

  return (
    <Box p={4}>
      <Heading fontSize="2xl" mb={4}>
        Professional Profile
      </Heading>

      {/* Professional Details */}
      {professional ? (
        <Box mb={6}>
          <Text>Name: {professional.name}</Text>
          <Text>
            Categories:{" "}
            {professional.categories?.map((cat) => cat.name).join(", ") ||
              "None"}
          </Text>
          <Text>
            Available Hours: {professional.availableHours || "Not set"}
          </Text>
        </Box>
      ) : (
        <Spinner />
      )}

      {/* Calendar View for Unavailable Dates */}
      <Box mb={6}>
        <Heading size="md" mb={2}>
          Unavailable Dates
        </Heading>
        {unavailableDates.length > 0 ? (
          <DatePicker
            inline
            selected={null} // No selection required
            highlightDates={unavailableDates} // Highlight unavailable dates
            disabledKeyboardNavigation
          />
        ) : (
          <Text>No unavailable dates provided.</Text>
        )}
      </Box>

      {/* Reviews Section */}
      <Box mt={6}>
        <Heading size="md" mb={2}>
          Reviews
        </Heading>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Box
              key={review._id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              width="100%"
              mb={2}
            >
              <Text fontWeight="bold">User: {review.user.name}</Text>
              <Text>Service: {review.service.name}</Text>
              <Text>Rating: {review.rating}/5</Text>
              <Text>{review.reviewText}</Text>
            </Box>
          ))
        ) : (
          <Text>No reviews for this account yet.</Text>
        )}
      </Box>

      {/* Add Review Button */}
      {canWriteReview && (
        <Button
          colorScheme="teal"
          mt={4}
          onClick={() =>
            router.push(`/reviewForm?professionalId=${professional._id}`)
          }
        >
          Write a Review
        </Button>
      )}

      {/* Book Professional Button */}
      {professional && (
        <Button
          colorScheme="teal"
          mt={4}
          onClick={() =>
            router.push(`/bookingForm?professionalId=${professional._id}`)
          }
        >
          Hire Professional
        </Button>
      )}
    </Box>
  );
};

export default ProfessionalProfile;
