import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');  // Redirect to login if token is missing
      }
    }, [router]);

    // Render the wrapped component only if the token exists
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;