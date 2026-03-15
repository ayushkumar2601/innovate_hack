"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Bot, 
  Github, 
  Twitter, 
  Disc as Discord, 
  Mail,
  Heart,
  Zap,
  Shield
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Deploy Agent", href: "/deploy" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    resources: [
      { label: "Documentation", href: "/docs" },
      { label: "Support", href: "/support" },
      { label: "API Reference", href: "/api" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Discord, href: "https://discord.com", label: "Discord" },
    { icon: Mail, href: "mailto:hello@agentforge.com", label: "Email" },
  ];

  return (
    <footer 
      className="relative border-t overflow-hidden"
      style={{ 
        background: "#0B0F0E",
        borderColor: "rgba(0, 255, 156, 0.1)"
      }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#00FF9C] to-transparent opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center glow-green"
                style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}
              >
                <Bot className="w-6 h-6" style={{ color: "#050505" }} />
              </motion.div>
              <span className="text-2xl font-bold gradient-text">
                AgentForge
              </span>
            </Link>
            
            <p className="text-sm mb-6 max-w-md" style={{ color: "#7BE3B3" }}>
              The premier marketplace for autonomous AI agents on Solana. Deploy, discover, and monetize intelligent automation.
            </p>

            {/* Stats badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div 
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                style={{ 
                  background: "rgba(0, 255, 156, 0.1)",
                  border: "1px solid rgba(0, 255, 156, 0.2)"
                }}
              >
                <Zap className="w-3 h-3" style={{ color: "#00FF9C" }} />
                <span style={{ color: "#E8FFF5" }}>Live on Devnet</span>
              </div>
              <div 
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                style={{ 
                  background: "rgba(0, 255, 156, 0.1)",
                  border: "1px solid rgba(0, 255, 156, 0.2)"
                }}
              >
                <Shield className="w-3 h-3" style={{ color: "#00FF9C" }} />
                <span style={{ color: "#E8FFF5" }}>Secure</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-2 rounded-lg transition-all glow-green-hover"
                  style={{ 
                    background: "rgba(0, 255, 156, 0.1)",
                    border: "1px solid rgba(0, 255, 156, 0.2)"
                  }}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" style={{ color: "#00FF9C" }} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h3 
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ 
                  color: "#E8FFF5",
                  letterSpacing: "0.05em"
                }}
              >
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-all hover:translate-x-1 inline-block"
                      style={{ color: "#7BE3B3" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#00FF9C"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#7BE3B3"}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div 
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderColor: "rgba(0, 255, 156, 0.1)" }}
        >
          <p className="text-sm flex items-center gap-1" style={{ color: "#7BE3B3" }}>
            © {currentYear} AgentForge. All rights reserved. Made with{' '}
            <Heart className="w-4 h-4 inline-block" style={{ color: "#00FF9C" }} fill="#00FF9C" />
            {' '}on Solana
          </p>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/privacy" 
              className="text-xs transition-colors"
              style={{ color: "#7BE3B3" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#00FF9C"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#7BE3B3"}
            >
              Privacy
            </Link>
            <span style={{ color: "#0E3B2E" }}>•</span>
            <Link 
              href="/terms" 
              className="text-xs transition-colors"
              style={{ color: "#7BE3B3" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#00FF9C"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#7BE3B3"}
            >
              Terms
            </Link>
          </div>

          {/* Built with badge */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs pulse-glow"
            style={{ 
              background: "rgba(0, 255, 156, 0.1)",
              border: "1px solid rgba(0, 255, 156, 0.2)"
            }}
          >
            <Zap className="w-3 h-3" style={{ color: "#00FF9C" }} />
            <span style={{ color: "#E8FFF5" }}>Powered by Solana</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}