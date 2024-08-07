import { useState } from 'react';
import { toast } from 'react-toastify';

const HeaderBar = ({ username }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownClick = (message) => {
    toast(message);
    setDropdownOpen(false);
  };

  return (
    <header>
      <div onClick={() => setDropdownOpen(!dropdownOpen)}>
        {username}
      </div>
      {dropdownOpen && (
        <ul className="dropdown-menu">
          <li onClick={() => handleDropdownClick('Update clicked')}>Update</li>
          <li onClick={() => handleDropdownClick('Signout clicked')}>Signout</li>
          <li onClick={() => handleDropdownClick('About clicked')}>About</li>
        </ul>
      )}
    </header>
  );
};

export default HeaderBar;