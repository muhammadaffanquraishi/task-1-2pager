import Link from "next/link";

const SideMenu = () => {
  return (
    <nav
      style={{
        padding: "10px",
        borderRight: "1px solid #ccc",
        height: "100vh",
      }}
    >
      <h2>Menu</h2>
      <ul>
        <li>
          <Link href="/">Form Page</Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideMenu;
