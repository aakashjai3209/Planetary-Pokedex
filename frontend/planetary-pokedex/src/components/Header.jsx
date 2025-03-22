import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-900 text-blue-500 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Updated Title */}
        <h1 className="text-3xl font-bold">
          <span className="text-white">Planetary</span>{" "}
          <span className="text-blue-500">Pokedex</span>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                to="/" 
                className="text-white text-2xl hover:text-blue-400 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/pokedex" 
                className="text-white text-2xl hover:text-blue-400 transition-colors duration-200"
              >
                Planetdex
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;