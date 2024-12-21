import React, { useState } from "react";
import { Box, Input, Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";

const PaymentForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const toast = useToast();
  const { professionalId, serviceId, bookingId } = router.query;

  // Handle form submission to mock payment API
  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/payments",
        {
          cardNumber,
          expiryDate,
          cvv,
          amount,
          professionalId,
          serviceId, // Optional: Associate the payment with a service
          bookingId, // Optional: Associate the payment with a booking
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast({
          title: "Payment Successful!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/"); // Redirect to the homepage
      } else {
        toast({
          title: "Payment Failed!",
          description: response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error processing payment",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Input
        placeholder="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        mb={3}
      />
      <Input
        placeholder="Expiry Date (MM/YY)"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        mb={3}
      />
      <Input
        placeholder="CVV"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
        mb={3}
      />
      <Input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        mb={3}
      />
      <Button colorScheme="teal" onClick={handlePayment}>
        Pay Now
      </Button>
    </Box>
  );
};

export default PaymentForm;
