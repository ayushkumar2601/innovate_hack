"use client";

import { useState, useEffect } from "react";
import AgentCard from "@/components/AgentCard";
import Link from "next/link";
import { API_ENDPOINTS, getApiUrl } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Rocket, 
  Bot,
  X,
  ChevronDown,
  LayoutGrid,
  SlidersHorizontal,
  Zap,
  BarChart3,
  Coins
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  price: number;
  creator: string;
  category: string;
  rating: number;
  total_runs: number;
  created_at: string;
}

export default function Marketplace() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1 });
  const [sortBy, setSortBy] = useState("rating");

  const filterChips = ["All", "DeFi", "AI", "Data", "Security", "Management"];

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(getApiUrl(API_ENDPOINTS.AGENTS));
        const data = await response.json();
        setAgents(data);
        setFilteredAgents(data);
        
        const uniqueCategories = [...new Set(data.map((a: Agent) => a.category))];
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    let results = [...agents];

    if (searchQuery) {
      results = results.filter(
        (agent) =>
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "All") {
      results = results.filter(
        (agent) => agent.category === selectedCategory
      );
    }

    results = results.filter(
      (agent) => agent.price >= priceRange.min && agent.price <= priceRange.max
    );

    if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price_low") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high") {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === "runs") {
      results.sort((a, b) => b.total_runs - a.total_runs);
    } else if (sortBy === "newest") {
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredAgents(results);
  }, [searchQuery, selectedCategory, priceRange, sortBy, agents]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange({ min: 0, max: 1 });
    setSortBy("rating");
  };

  const hasActiveFilters = searchQuery || selectedCategory || priceRange.min > 0 || priceRange.max < 1 || sortBy !== "rating";

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#050505" }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse" 
             style={{ background: "radial-gradient(circle, #00FF9C 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl animate-pulse" 
             style={{ background: "radial-gradient(circle, #1ED760 0%, transparent 70%)", animationDelay: "2s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center glow-green"
                   style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
                <Bot className="w-6 h-6" style={{ color: "#050505" }} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "#E8FFF5" }}>
                AI Agent <span className="gradient-text">Marketplace</span>
              </h1>
            </div>
            <p className="text-lg" style={{ color: "#7BE3B3" }}>
              Discover and run autonomous AI agents on Solana
            </p>
          </div>
          
          <Link href="/deploy">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 glow-green-hover"
              style={{
                background: "linear-gradient(135deg, #00FF9C, #1ED760)",
                color: "#050505"
              }}
            >
              <Rocket className="w-4 h-4" />
              Deploy Your Agent
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: "#00FF9C" }} />
            <input
              type="text"
              placeholder="Search agents by name or keywords..."
              className="w-full pl-12 pr-4 py-4 rounded-xl glass-card transition-all focus:glow-green"
              style={{ 
                background: "rgba(11, 15, 14, 0.8)",
                border: "1px solid rgba(0, 255, 156, 0.2)",
                color: "#E8FFF5",
                outline: "none",
                fontSize: "16px"
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {filterChips.map((chip) => (
            <motion.button
              key={chip}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(chip === "All" ? "" : chip)}
              className="px-4 py-2 rounded-xl font-medium transition-all"
              style={{
                background: selectedCategory === chip || (chip === "All" && !selectedCategory)
                  ? "linear-gradient(135deg, #00FF9C, #1ED760)"
                  : "rgba(0, 255, 156, 0.1)",
                border: "1px solid rgba(0, 255, 156, 0.2)",
                color: selectedCategory === chip || (chip === "All" && !selectedCategory)
                  ? "#050505"
                  : "#00FF9C"
              }}
            >
              {chip}
            </motion.button>
          ))}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all"
            style={{
              background: showFilters ? "rgba(0, 255, 156, 0.2)" : "rgba(0, 255, 156, 0.1)",
              border: "1px solid rgba(0, 255, 156, 0.2)",
              color: "#00FF9C"
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            More Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 glass-card p-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: "#7BE3B3" }}>
                    <BarChart3 className="w-4 h-4" style={{ color: "#00FF9C" }} />
                    Sort By
                  </label>
                  <select
                    className="w-full p-3 rounded-xl glass-card"
                    style={{ 
                      background: "#050505",
                      border: "1px solid rgba(0, 255, 156, 0.2)",
                      color: "#E8FFF5",
                      outline: "none"
                    }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="rating">⭐ Top Rated</option>
                    <option value="price_low">💰 Price: Low to High</option>
                    <option value="price_high">💰 Price: High to Low</option>
                    <option value="runs">📊 Most Popular</option>
                    <option value="newest">🆕 Newest First</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: "#7BE3B3" }}>
                    <Filter className="w-4 h-4" style={{ color: "#00FF9C" }} />
                    Category
                  </label>
                  <select
                    className="w-full p-3 rounded-xl glass-card"
                    style={{ 
                      background: "#050505",
                      border: "1px solid rgba(0, 255, 156, 0.2)",
                      color: "#E8FFF5",
                      outline: "none"
                    }}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: "#7BE3B3" }}>
                    <Coins className="w-4 h-4" style={{ color: "#00FF9C" }} />
                    Price: {priceRange.min} - {priceRange.max} SOL
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#00FF9C]"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#00FF9C]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-4 h-4" style={{ color: "#00FF9C" }} />
            <p style={{ color: "#7BE3B3" }}>
              Showing <span style={{ color: "#E8FFF5" }}>{filteredAgents.length}</span> of {agents.length} agents
            </p>
          </div>
          
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all glow-green-hover"
              style={{ 
                background: "rgba(0, 255, 156, 0.1)",
                border: "1px solid rgba(0, 255, 156, 0.2)",
                color: "#00FF9C"
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-3 h-3" />
              Clear Filters
            </motion.button>
          )}
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-t-[#00FF9C] border-r-[#1ED760] border-b-transparent border-l-transparent mb-4"
            />
            <p style={{ color: "#7BE3B3" }}>Loading autonomous agents...</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 glass-card"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50"
                 style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
              <Search className="w-10 h-10" style={{ color: "#050505" }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#E8FFF5" }}>No agents found</h3>
            <p className="mb-6" style={{ color: "#7BE3B3" }}>
              Try adjusting your filters or search query
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl font-semibold glow-green-hover"
              style={{
                background: "linear-gradient(135deg, #00FF9C, #1ED760)",
                color: "#050505"
              }}
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AgentCard agent={agent} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 glass-card p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5" style={{ color: "#00FF9C" }} />
            <h2 className="text-xl font-bold" style={{ color: "#E8FFF5" }}>Platform Statistics</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-4 rounded-xl text-center"
              style={{ background: "#050505" }}
            >
              <p className="text-3xl font-bold mb-1 gradient-text">
                {agents.length}
              </p>
              <p className="text-sm" style={{ color: "#7BE3B3" }}>Total Agents</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-4 rounded-xl text-center"
              style={{ background: "#050505" }}
            >
              <p className="text-3xl font-bold mb-1 gradient-text">
                {categories.length}
              </p>
              <p className="text-sm" style={{ color: "#7BE3B3" }}>Categories</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-4 rounded-xl text-center"
              style={{ background: "#050505" }}
            >
              <p className="text-3xl font-bold mb-1 gradient-text">
                {agents.reduce((sum, a) => sum + a.total_runs, 0).toLocaleString()}
              </p>
              <p className="text-sm" style={{ color: "#7BE3B3" }}>Total Runs</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-4 rounded-xl text-center"
              style={{ background: "#050505" }}
            >
              <p className="text-3xl font-bold mb-1 gradient-text">
                {agents.length > 0
                  ? (agents.reduce((sum, a) => sum + a.rating, 0) / agents.length).toFixed(1)
                  : "0.0"}
              </p>
              <p className="text-sm" style={{ color: "#7BE3B3" }}>Avg Rating</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}