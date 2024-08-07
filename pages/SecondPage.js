import { useState, useEffect } from 'react';
import { useFormData } from '../context/FormDataContext';
import Layout from '../components/Layout';
import HeaderBar from '../components/HeaderBar';

const SecondPage = () => {
  const { formData } = useFormData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    mounted&&(
    <Layout>
      <HeaderBar username={formData?.username || 'User'} />
      <h1>Data Overview</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formData?.email}</td>
            <td>{formData?.username}</td>
            <td>{formData?.phone}</td>
            <td>{formData?.age}</td>
          </tr>
        </tbody>
      </table>
      <div className="cards">
        <div className="card">
          <h2>Card 1</h2>
          <p>Some information about the website.</p>
        </div>
        <div className="card">
          <h2>Card 2</h2>
          <p>More information about the website.</p>
        </div>
        <div className="card">
          <h2>Card 3</h2>
          <p>Additional information about the website.</p>
        </div>
        <div className="card">
          <h2>Card 4</h2>
          <p>Further information about the website.</p>
        </div>
      </div>
    </Layout>
    )
  );
};

export default SecondPage;