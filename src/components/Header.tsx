import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="p-4 bg-gray-200 flex gap-4 items-center flex-shrink-0">
      <Link to="/" className="hover:text-blue-500 font-bold">
        Home
      </Link>
    </header>
  );
};

export default Header;