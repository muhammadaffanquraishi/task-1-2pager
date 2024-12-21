import React from 'react';
import ProfessionalProfile from '../../pages/professionalProfile';
import { useRouter } from 'next/router';

const ProfessionalProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <p>Loading...</p>; // Display loading until `id` is available
  }

  return <ProfessionalProfile professionalId={id} />;
};

export default ProfessionalProfilePage;