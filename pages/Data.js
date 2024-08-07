import { useEffect, useState } from 'react';
import { useFormContext } from '../src/context/FormContext';
import SideMenu from '../src/components/SideMenu';
import { toast } from 'react-toastify';

export default function Data() {
  const { formData } = useFormContext();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!formData) {
      toast.error('No data found. Redirecting to the form page.');
      // Redirect to form page if no data
      window.location.href = '/';
    }
  }, [formData]);

  const handleDropdownToggle = () => setShowDropdown(!showDropdown);
  const handleDropdownAction = (action) => {
    toast.info(action);
    setShowDropdown(false);
  };

  return (
    <div style={{ display: 'flex' }}>
      <SideMenu />
      <main style={{ padding: '20px', flex: 1 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Data Page</h1>
          <div>
            <button onClick={handleDropdownToggle}>{formData?.username || 'User'}</button>
            {showDropdown && (
              <div style={{ position: 'absolute', background: '#fff', border: '1px solid #ccc', padding: '10px' }}>
                <button onClick={() => handleDropdownAction('Update')}>Update</button>
                <button onClick={() => handleDropdownAction('Signout')}>Signout</button>
                <button onClick={() => handleDropdownAction('About')}>About</button>
              </div>
            )}
          </div>
        </header>
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
            {formData ? (
              <tr>
                <td>{formData.email}</td>
                <td>{formData.username}</td>
                <td>{formData.phone}</td>
                <td>{formData.age}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="4">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
          <div style={{ border: '1px solid #ccc', padding: '10px', flex: 1 }}>
            <h3>Card 1</h3>
            <p>This is some information about the website.</p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '10px', flex: 1 }}>
            <h3>Card 2</h3>
            <p>More details about our services and offerings.</p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '10px', flex: 1 }}>
            <h3>Card 3</h3>
            <p>Additional information on features and benefits.</p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '10px', flex: 1 }}>
            <h3>Card 4</h3>
            <p>Other relevant data and insights.</p>
          </div>
        </div>
      </main>
    </div>
  );
}