import React from "react";

// SVG for the Framix logo icon, matching the design
const FramixIcon = () => (
  <svg
    width="68"
    height="68"
    viewBox="0 0 68 68"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17 0L34 17L17 34L0 17L17 0Z" fill="#F472B6" />
    <path d="M17 34L34 51L17 68L0 51L17 34Z" fill="#F472B6" />
    <path d="M51 0L68 17L51 34L34 17L51 0Z" fill="#F472B6" />
    <path d="M51 34L68 51L51 68L34 51L51 34Z" fill="#F472B6" />
  </svg>
);

const Footer = () => {
  return (
    // Main footer container with a black background and white text
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col">
          {/* Top section with navigation links */}
          <div className="mb-12">
            {/* Mobile: 2 rows, Desktop: 4 columns */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {/* Home Section */}
              <div className="flex flex-col sm:ml-32">
                <h3 className="text-base font-semibold text-white mb-5">
                  Home
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-400 hover:text-white"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-400 hover:text-white"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-400 hover:text-white"
                    >
                      Testimonials
                    </a>
                  </li>
                </ul>
              </div>
              {/* Products Section */}
              <div className="sm:ml-32">
                <h3 className="text-base font-semibold text-white mb-5">
                  Products
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-400 hover:text-white"
                    >
                      Components
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-400 hover:text-white"
                    >
                      Templates
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-400 hover:text-white"
                    >
                      UI Kits
                    </a>
                  </li>
                </ul>
              </div>
              {/* Resources Section */}
              <div className="sm:ml-32">
                <h3 className="text-base font-semibold text-white mb-5">
                  Resources
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-400 hover:text-white"
                    >
                      Community
                    </a>
                  </li>
                </ul>
              </div>
              {/* Legal & Policy Section */}
              <div className="sm:ml-32">
                <h3 className="text-base font-semibold text-white mb-5">
                  Legal & Policy
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-400 hover:text-white"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-gray-400 hover:text-white"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom section with the main logo */}
          <div className="w-full flex flex-row items-center justify-center">
            <div className="w-full flex flex-row items-center justify-center">
              <FramixIcon />
              <span className="text-[10vw] font-bold tracking-tighter ml-8">
                Framix
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App component to render the Footer
export default function App() {
  return (
    <div className="bg-white">
      {/* This is a container for demonstration. 
          You can add other components of your page here. */}
      <Footer />
    </div>
  );
}
