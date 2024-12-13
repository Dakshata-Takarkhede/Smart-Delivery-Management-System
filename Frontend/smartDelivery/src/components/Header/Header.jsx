import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../../services/usersApi";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation(); // To get the current route
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Example user data (replace with actual user data)
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);
  

  // Navigation links
  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Orders", path: "/orders" },
    { name: "Partners", path: "/partners" },
    { name: "Assignments", path: "/assignments" },
  ];

  const handleLogout = async() => {
    const isConfirmed = window.confirm('Are you sure you want to logout?');
    if (!isConfirmed) return;
    try {
      logoutUser();
      localStorage.setItem('user', JSON.stringify({}));
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <header className="bg-[#c54119] text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo Section */}
          <div className="text-2xl font-semibold tracking-wide">Ship Mate</div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg hover:bg-orange-600 hover:px-1 hover:rounded-lg transition duration-300 ${
                  location.pathname === link.path ? "border-b-2 border-white" : ""}`}
                >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-2 focus:outline-none hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md transition duration-300"
            >
              <img
                src={user.avatar}
                alt="User Profile"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <span className="hidden md:inline-block text-white font-medium">
                {user.fullName}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                {/* <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 transition duration-300"
                >
                  Profile
                </Link> */}
                {/* <Link
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-100 transition duration-300"
                >
                  Settings
                </Link> */}
                <button 
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100 transition duration-300"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu (Toggle visibility) */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col space-y-4 py-4 px-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-white hover:text-gray-200 transition duration-300 ${
                  location.pathname === link.path ? "font-semibold" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
