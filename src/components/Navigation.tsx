import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserAccountMenu } from "@/components/UserAccountMenu";
import { useAuth } from "@/context/AuthContext";

// A reusable NavLink component to keep the main navigation clean
// and handle the active/hover animation logic.
const NavLink = ({
  to,
  children,
  ...rest
}: {
  to: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      // 'group' allows us to style a child element based on the parent's state (e.g., on hover)
      className={`relative group transition-colors ${
        isActive ? "text-white" : "text-neutral-400 hover:text-white"
      }`}
      {...rest}
    >
      {children}
      {/* This is the animated underline */}
      <span
        className={`absolute bottom-[-4px] left-0 h-[2px] bg-[#E84288] transition-all duration-300 ease-in-out
          ${isActive ? "w-full" : "w-0 group-hover:w-full"}
        `}
      />
    </Link>
  );
};

import {
  Sheet,
  SheetContent,
  SheetOverlay,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";
// VisuallyHidden component for accessibility
const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      border: 0,
      clip: "rect(0 0 0 0)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: "1px",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

const Navigation = () => {
  const { user, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Navigation links for reuse
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/components", label: "Components" },
    // { to: "/templates", label: "Templates" },
    { to: "/community", label: "Community" },
    // { to: "/blogs", label: "Blogs" },
    // { to: "/pricing", label: "Pricing" },
  ];

  return (
    <nav className="bg-[#111111] sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img src="/fremix.png" alt="Framix Logo" className="h-9 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden md:block">
            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-neutral-800 animate-pulse" />
            ) : user ? (
              <UserAccountMenu user={user} />
            ) : (
              <Link to="/signin">
                <Button
                  variant="default"
                  className="bg-[#FF9AC9] text-black font-semibold hover:bg-[#FF9AC9]/90 rounded-lg min-w-[160px]"
                >
                  Explore Now
                </Button>
              </Link>
            )}
          </div>

          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMobileOpen(true)}
                  className="h-10 w-10 hover:bg-[#E84288]/10 transition-all duration-300 rounded-lg focus-visible:ring-2 focus-visible:ring-[#E84288] focus-visible:ring-offset-2"
                >
                  <Menu className="h-6 w-6 text-[#E84288] transition-transform duration-300 hover:scale-110" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="p-0 pt-8 bg-[#111111] border-l border-neutral-800 text-white focus:outline-none w-[280px] sm:w-[320px]"
                id="mobile-menu"
                tabIndex={-1}
                aria-modal="true"
                role="dialog"
              >
                {/* Visually hidden dialog title for accessibility */}
                <DialogTitle asChild>
                  <VisuallyHidden>Navigation Menu</VisuallyHidden>
                </DialogTitle>

                {/* Logo Section */}
                <div className="px-8 pb-4">
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center"
                  >
                    <img
                      src="/fremix.png"
                      alt="Framix Logo"
                      className="h-9 w-auto"
                    />
                  </Link>
                </div>

                <nav
                  className="flex flex-col gap-2 px-6 py-6 text-base font-medium"
                  autoFocus
                >
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      tabIndex={0}
                      className="py-3 px-4 rounded-lg hover:bg-neutral-800/50 active:bg-neutral-800 transition-all duration-200 min-h-[44px] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E84288]"
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>

                {/* Visual separator */}
                <div className="mx-6 my-4 border-t border-neutral-800" />

                {/* Account section with improved spacing */}
                <div className="px-6 pb-6">
                  {isLoading ? (
                    <div className="h-10 w-10 rounded-full bg-neutral-800 animate-pulse" />
                  ) : user ? (
                    <div className="py-2">
                      <UserAccountMenu
                        user={user}
                        onNavigate={() => setMobileOpen(false)}
                      />
                    </div>
                  ) : (
                    <Link to="/signin" tabIndex={0}>
                      <Button
                        variant="default"
                        className="w-full bg-[#FF9AC9] text-white font-semibold hover:bg-[#FF9AC9]/90 hover:shadow-lg hover:shadow-[#FF9AC9]/20 rounded-lg transition-all duration-300 min-h-[44px] min-w-[160px] focus-visible:ring-2 focus-visible:ring-[#FF9AC9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
                        onClick={() => setMobileOpen(false)}
                      >
                        Explore Now
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
