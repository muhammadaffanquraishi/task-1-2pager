import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaCode, FaPencilAlt, FaLaptop, FaMobileAlt } from "react-icons/fa";
import withAuth from './../pages/utils/withAuth';

const ServiceCard = ({ icon, title, description }) => (
  <Box
    p={6}
    borderWidth={1}
    borderRadius="lg"
    textAlign="center"
    boxShadow="md"
    _hover={{ boxShadow: "xl", transform: "scale(1.05)" }}
    transition="all 0.3s ease"
  >
    <Icon as={icon} boxSize={12} mb={4} color="teal.500" />
    <Heading size="md" mb={2}>
      {title}
    </Heading>
    <Text color="gray.600">{description}</Text>
  </Box>
);

const Services = () => {
  return (
    <Box py={10} px={6}>
      <VStack spacing={6} align="center" mb={12}>
        <Heading as="h1" size="2xl" textAlign="center">
          Our Services
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="lg" textAlign="center">
          We offer a wide range of professional services to meet your needs. We
          promise to provide every service with a smile, and to your highest
          level of satisfaction.
        </Text>
      </VStack>

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
        <ServiceCard
          icon={FaPencilAlt}
          title="Content Writing"
          description="High-quality content writing services for blogs, articles, and more."
        />
        <ServiceCard
          icon={FaLaptop}
          title="Digital Marketing"
          description="Comprehensive digital marketing solutions to grow your online presence."
        />
        <ServiceCard
          icon={FaPencilAlt}
          title="Graphic Design"
          description="Creative graphic design services to bring your ideas to life."
        />
      </SimpleGrid>
    </Box>
  );
};

export default withAuth(Services);
