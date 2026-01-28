import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Define the interface for your props
interface HeaderProps {
  onSignIn: () => void;
}

export function Header({ onSignIn }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Impact", href: "#impact" },
    { label: "Partners", href: "#partners" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#18392b] rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">S</span>
            </div>
            <span className="text-xl font-semibold text-[#18392b]">Signify</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-[#18392b] transition-colors"
              >
                {item.label}
              </a>
            ))}

            <button
              onClick={onSignIn}
              className="bg-[#18392b] text-white px-6 py-2.5 rounded-lg hover:bg-[#234a39] transition-colors"
            >
              Sign In
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#18392b]" />
            ) : (
              <Menu className="w-6 h-6 text-[#18392b]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-2 text-gray-700 hover:text-[#18392b] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onSignIn();
                }}
                className="block bg-[#18392b] text-white px-6 py-2.5 rounded-lg text-center mt-4 w-full hover:bg-[#234a39]"
              >
                Sign In
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}