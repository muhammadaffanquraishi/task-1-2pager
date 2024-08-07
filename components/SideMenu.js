import Link from 'next/link';

const SideMenu = () => (
  <nav className="sidebar">
    <ul>
      <li>
        <Link href="/">Form Page</Link>
      </li>
    </ul>
  </nav>
);

export default SideMenu;