"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Wallet, User, Zap, Bot, Play } from "lucide-react";
import { useState } from "react";

// Define the Agent interface
interface Agent {
  id: string;
  name: string;
  description: string;
  price: number;
  creator: string;
  endpoint?: string;
  rating: number;
  createdAt?: string;
  category?: string;
  total_runs?: number;
}

interface Props {
  agent: Agent;
}

export default function AgentCard({ agent }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Shorten creator address for display
  const shortCreator = agent.creator.slice(0, 6) + "..." + agent.creator.slice(-4);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative glass-card p-6 cursor-pointer card-hover"
      style={{ 
        background: isHovered ? "rgba(11, 15, 14, 0.9)" : "rgba(11, 15, 14, 0.8)",
        transition: "all 0.3s ease"
      }}
    >
      {/* Glow effect on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(0, 255, 156, 0.1), rgba(30, 215, 96, 0.1))",
            filter: "blur(20px)",
            zIndex: -1
          }}
        />
      )}

      {/* Agent Icon */}
      <div className="flex justify-between items-start mb-4">
        <motion.div
          animate={{ 
            rotate: isHovered ? 360 : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.5 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center glow-green"
          style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}
        >
          <Bot className="w-6 h-6" style={{ color: "#050505" }} />
        </motion.div>

        {/* Category badge */}
        <span 
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ 
            background: "rgba(0, 255, 156, 0.1)",
            border: "1px solid rgba(0, 255, 156, 0.2)",
            color: "#00FF9C"
          }}
        >
          {agent.category || "AI Agent"}
        </span>
      </div>

      {/* Agent Name */}
      <h3 className="text-xl font-bold mb-2" style={{ color: "#E8FFF5" }}>
        {agent.name}
      </h3>

      {/* Description */}
      <p className="text-sm mb-4 line-clamp-2" style={{ color: "#7BE3B3" }}>
        {agent.description}
      </p>
      
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" style={{ color: "#00FF9C" }} fill="#00FF9C" />
          <span className="text-sm font-medium" style={{ color: "#E8FFF5" }}>
            {agent.rating}
          </span>
        </div>

        {/* Runs */}
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" style={{ color: "#00FF9C" }} />
          <span className="text-sm font-medium" style={{ color: "#E8FFF5" }}>
            {agent.total_runs?.toLocaleString() || "0"} runs
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg" 
           style={{ background: "#050505" }}>
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4" style={{ color: "#00FF9C" }} />
          <span className="text-sm" style={{ color: "#7BE3B3" }}>Price</span>
        </div>
        <span className="font-bold" style={{ color: "#00FF9C" }}>
          {agent.price} SOL
        </span>
      </div>

      {/* Creator */}
      <div className="flex items-center gap-2 mb-4 p-2 rounded-lg" 
           style={{ background: "#050505" }}>
        <div className="w-6 h-6 rounded-full flex items-center justify-center"
             style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
          <User className="w-3 h-3" style={{ color: "#050505" }} />
        </div>
        <span className="text-xs font-mono" style={{ color: "#7BE3B3" }}>
          {shortCreator}
        </span>
      </div>

      {/* Action Button */}
      <Link href={`/agent/${agent.id}`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-semibold relative overflow-hidden glow-green-hover"
          style={{
            background: "linear-gradient(135deg, #00FF9C, #1ED760)",
            color: "#050505"
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Play className="w-4 h-4" />
            Run Agent
          </span>
        </motion.button>
      </Link>
    </motion.div>
  );
}