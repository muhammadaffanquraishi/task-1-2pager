import React from 'react';
import { useRouter } from 'next/router';
import ReviewForm from '../reviewForm';

const ReviewPage = () => {
  const router = useRouter();
  const { professionalId } = router.query; // Extract professionalId from the URL

  return <ReviewForm professionalId={professionalId} />;
};

export default ReviewPage;