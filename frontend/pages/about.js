import React from "react";
import { Box, Heading, Text, Image, Stack } from "@chakra-ui/react";

const About = () => {
  return (
    <Box p={4} maxW="800px" mx="auto">
      <Heading as="h1" size="2xl" mb={4} textAlign="center">
        About Us
      </Heading>

      <Stack direction={["column", "row"]} spacing={8} mb={8}>
        <Box flex="2">
          <Text fontSize="lg" mb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            auctor justo quis augue fermentum, at sollicitudin quam facilisis.
            Duis vehicula nisl quis nisi bibendum, nec convallis mi malesuada.
            Fusce nec odio turpis. Nullam vehicula, lorem ut scelerisque
            posuere, sapien sem luctus mauris, vitae malesuada ex arcu ac est.
          </Text>
          <Text fontSize="lg" mb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            auctor justo quis augue fermentum, at sollicitudin quam facilisis.
            Duis vehicula nisl quis nisi bibendum, nec convallis mi malesuada.
            Fusce nec odio turpis. Nullam vehicula, lorem ut scelerisque
            posuere, sapien sem luctus mauris, vitae malesuada ex arcu ac est.
          </Text>
        </Box>
      </Stack>

      <Heading as="h2" size="lg" mb={4}>
        Our Vision
      </Heading>
      <Text fontSize="lg" mb={8}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor
        justo quis augue fermentum, at sollicitudin quam facilisis. Duis
        vehicula nisl quis nisi bibendum, nec convallis mi malesuada. Fusce nec
        odio turpis. Nullam vehicula, lorem ut scelerisque posuere, sapien sem
        luctus mauris, vitae malesuada ex arcu ac est.
      </Text>

      <Heading as="h2" size="lg" mb={4}>
        Our Team
      </Heading>
      <Text fontSize="lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor
        justo quis augue fermentum, at sollicitudin quam facilisis. Duis
        vehicula nisl quis nisi bibendum, nec convallis mi malesuada. Fusce nec
        odio turpis. Nullam vehicula, lorem ut scelerisque posuere, sapien sem
        luctus mauris, vitae malesuada ex arcu ac est.
      </Text>
    </Box>
  );
};

export default About;
