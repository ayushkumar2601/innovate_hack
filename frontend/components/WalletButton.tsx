"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Loader2 } from "lucide-react";

export default function WalletButton() {
  const [isClient, setIsClient] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a placeholder with the same dimensions during SSR
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 min-w-[160px]"
        style={{ 
          background: "#0B0F0E",
          border: "1px solid rgba(0, 255, 156, 0.2)",
          color: "#7BE3B3"
        }}
      >
        <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#00FF9C" }} />
        <span>Loading...</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      {/* Custom styling for WalletMultiButton */}
      <style jsx global>{`
        .wallet-adapter-button {
          background: linear-gradient(135deg, #00FF9C, #1ED760) !important;
          color: #050505 !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          letter-spacing: 0.025em !important;
          padding: 0.75rem 1.5rem !important;
          border-radius: 0.75rem !important;
          transition: all 0.3s ease !important;
          border: none !important;
          position: relative !important;
          overflow: hidden !important;
          min-width: 160px !important;
          justify-content: center !important;
          gap: 0.5rem !important;
          box-shadow: 0 0 20px rgba(0, 255, 156, 0.3) !important;
        }

        .wallet-adapter-button:hover {
          background: linear-gradient(135deg, #1ED760, #00FF9C) !important;
          box-shadow: 0 0 30px rgba(0, 255, 156, 0.5) !important;
          transform: translateY(-1px) !important;
        }

        .wallet-adapter-button:active {
          transform: scale(0.98) !important;
        }

        .wallet-adapter-button:not([disabled]):hover {
          background: linear-gradient(135deg, #1ED760, #00FF9C) !important;
        }

        .wallet-adapter-button-trigger {
          background: linear-gradient(135deg, #00FF9C, #1ED760) !important;
        }

        .wallet-adapter-button-start-icon {
          margin-right: 8px !important;
        }

        .wallet-adapter-dropdown {
          font-family: 'Inter', sans-serif !important;
        }

        .wallet-adapter-dropdown-list {
          background: #0B0F0E !important;
          border: 1px solid rgba(0, 255, 156, 0.2) !important;
          border-radius: 0.75rem !important;
          padding: 0.5rem !important;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.8), 0 0 30px rgba(0, 255, 156, 0.2) !important;
        }

        .wallet-adapter-dropdown-list-item {
          background: transparent !important;
          color: #E8FFF5 !important;
          font-size: 14px !important;
          padding: 0.75rem 1rem !important;
          border-radius: 0.5rem !important;
          transition: all 0.2s ease !important;
        }

        .wallet-adapter-dropdown-list-item:hover {
          background: rgba(0, 255, 156, 0.1) !important;
          color: #00FF9C !important;
        }

        .wallet-adapter-modal-wrapper {
          background: #0B0F0E !important;
          border-radius: 1rem !important;
          border: 1px solid rgba(0, 255, 156, 0.2) !important;
          box-shadow: 0 0 50px rgba(0, 255, 156, 0.2) !important;
        }

        .wallet-adapter-modal-button-close {
          background: #050505 !important;
          color: #00FF9C !important;
        }

        .wallet-adapter-modal-title {
          color: #E8FFF5 !important;
          font-family: 'Inter', sans-serif !important;
        }

        .wallet-adapter-modal-content {
          color: #7BE3B3 !important;
        }

        .wallet-adapter-modal-list {
          margin: 1rem 0 !important;
        }

        .wallet-adapter-modal-list .wallet-adapter-button {
          background: #050505 !important;
          color: #E8FFF5 !important;
          border: 1px solid rgba(0, 255, 156, 0.2) !important;
          font-weight: normal !important;
          box-shadow: none !important;
        }

        .wallet-adapter-modal-list .wallet-adapter-button:hover {
          background: rgba(0, 255, 156, 0.1) !important;
          border-color: #00FF9C !important;
          box-shadow: 0 0 20px rgba(0, 255, 156, 0.2) !important;
        }
      `}</style>

      {/* Animated glow effect */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-xl"
          style={{ 
            background: "linear-gradient(135deg, #00FF9C, #1ED760)",
            filter: "blur(8px)",
            zIndex: -1
          }}
        />
      )}

      <WalletMultiButton />
    </motion.div>
  );
}