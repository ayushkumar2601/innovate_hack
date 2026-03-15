"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletButton from "./WalletButton";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/deploy", label: "Deploy Agent" },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-50 glass-card"
        style={{ 
          background: "rgba(11, 15, 14, 0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0, 255, 156, 0.1)",
          borderRadius: "0"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center glow-green-hover"
                style={{ 
                  background: "linear-gradient(135deg, #00FF9C, #1ED760)",
                }}
              >
                <Bot className="w-5 h-5" style={{ color: "#050505" }} />
              </motion.div>
              <span 
                className="text-xl font-bold hidden sm:block gradient-text"
              >
                AgentForge
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-2 rounded-lg group transition-all duration-300"
                  >
                    <span 
                      className="relative z-10 text-sm font-medium transition-colors flex items-center gap-2"
                      style={{ color: isActive ? "#00FF9C" : "#7BE3B3" }}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-lg"
                        style={{ 
                          background: "rgba(0, 255, 156, 0.1)",
                          border: "1px solid rgba(0, 255, 156, 0.2)"
                        }}
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <motion.div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                      style={{ background: "linear-gradient(90deg, #00FF9C, #1ED760)" }}
                      initial={false}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              {/* Wallet Button */}
              <div className="hidden sm:block">
                <WalletButton />
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg transition-all duration-300 glow-green-hover"
                style={{ 
                  background: "rgba(0, 255, 156, 0.1)",
                  border: "1px solid rgba(0, 255, 156, 0.2)"
                }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" style={{ color: "#00FF9C" }} />
                ) : (
                  <Menu className="w-5 h-5" style={{ color: "#00FF9C" }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
              style={{ 
                borderTop: "1px solid rgba(0, 255, 156, 0.1)",
                background: "#0B0F0E"
              }}
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg transition-all duration-300"
                      style={{ 
                        background: isActive ? "rgba(0, 255, 156, 0.1)" : "transparent",
                        border: isActive ? "1px solid rgba(0, 255, 156, 0.2)" : "1px solid transparent"
                      }}
                    >
                      <span className="flex items-center gap-2" style={{ color: isActive ? "#00FF9C" : "#7BE3B3" }}>
                        {Icon && <Icon className="w-4 h-4" />}
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
                
                {/* Mobile wallet button */}
                <div className="pt-2">
                  <WalletButton />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}