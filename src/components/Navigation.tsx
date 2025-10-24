import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserAccountMenu } from "@/components/UserAccountMenu";
import { useAuth } from "@/context/AuthContext";

// A reusable NavLink component to keep the main navigation clean
// and handle the active/hover animation logic.
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      // 'group' allows us to style a child element based on the parent's state (e.g., on hover)
      className={`relative group transition-colors ${
        isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
      }`}
    >
      {children}
      {/* This is the animated underline */}
      <span
        className={`absolute bottom-[-4px] left-0 h-[2px] bg-[#E84288] transition-all duration-300 ease-in-out
          ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
        `}
      />
    </Link>
  );
};

const Navigation = () => {
  const { user, isLoading } = useAuth();

  return (
    <nav className="bg-[#111111] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO UPDATED HERE */}
          <Link to="/" className="flex items-center">
            <img src="/fremix.png" alt="Framix Logo" className="h-9 w-auto" />
          </Link>

          {/* Navigation Links using the new NavLink component */}
          {/* On small screens this is hidden, on medium (md) and up it becomes a flex container */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/components">Components</NavLink>
            {/* <NavLink to="/templates">Templates</NavLink> */}
            <NavLink to="/community">Community</NavLink>
            {/* <NavLink to="/blogs">Blogs</NavLink> */}
            {/* <NavLink to="/pricing">Pricing</NavLink> */}
          </div>

          {/* Show user menu if logged in, otherwise show Explore Now button */}
          {isLoading ? (
            // Loading state - show a skeleton or nothing
            <div className="h-10 w-10 rounded-full bg-neutral-800 animate-pulse" />
          ) : user ? (
            // User is logged in - show account menu
            <UserAccountMenu user={user} />
          ) : (
            // User is not logged in - show Explore Now button
            <Link to="/signin">
              <Button
                variant="default"
                className="bg-[#E84288] text-black font-semibold hover:bg-[#E84288]/90 rounded-lg"
              >
                Explore Now
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;