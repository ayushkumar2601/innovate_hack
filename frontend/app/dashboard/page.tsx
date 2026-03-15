"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { API_ENDPOINTS, getApiUrl } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Wallet, 
  Bot, 
  Coins, 
  TrendingUp,
  Loader2,
  Rocket,
  Zap,
  BarChart3,
  Calendar,
  ArrowUpRight,
  Users,
  Clock,
  XCircle,
  ChevronRight
} from "lucide-react";

interface DashboardData {
  wallet: string;
  agents_deployed: number;
  total_earnings: number;
  total_runs: number;
  agents: any[];
}

export default function Dashboard() {
  const wallet = useWallet();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!wallet.publicKey) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          getApiUrl(API_ENDPOINTS.DASHBOARD(wallet.publicKey.toString()))
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [wallet.publicKey]);
  if (!wallet.publicKey) {
    return (
      <div className="min-h-screen py-16 px-4" style={{ background: "#050505" }}>
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse" 
               style={{ background: "radial-gradient(circle, #00FF9C 0%, transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl animate-pulse" 
               style={{ background: "radial-gradient(circle, #1ED760 0%, transparent 70%)", animationDelay: "2s" }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 glow-green"
                 style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
              <LayoutDashboard className="w-12 h-12" style={{ color: "#050505" }} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#E8FFF5" }}>
              Creator <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-xl mb-8" style={{ color: "#7BE3B3" }}>
              Track your AI agents' performance and earnings
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto p-8 rounded-3xl glass-card"
          >
            <Wallet className="w-16 h-16 mx-auto mb-4" style={{ color: "#00FF9C" }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#E8FFF5" }}>Wallet Not Connected</h2>
            <p className="mb-6" style={{ color: "#7BE3B3" }}>
              Please connect your wallet to view your dashboard and track your earnings.
            </p>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Link href="/">
                <button
                  className="px-6 py-3 rounded-xl font-medium w-full glow-green-hover"
                  style={{
                    background: "linear-gradient(135deg, #00FF9C, #1ED760)",
                    color: "#050505"
                  }}
                >
                  Connect Wallet
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#050505" }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse" 
             style={{ background: "radial-gradient(circle, #00FF9C 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl animate-pulse" 
             style={{ background: "radial-gradient(circle, #1ED760 0%, transparent 70%)", animationDelay: "2s" }} />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-green"
                   style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
                <LayoutDashboard className="w-5 h-5" style={{ color: "#050505" }} />
              </div>
              <h1 className="text-3xl font-bold" style={{ color: "#E8FFF5" }}>
                Creator <span className="gradient-text">Dashboard</span>
              </h1>
            </div>
            <p style={{ color: "#7BE3B3" }}>
              Welcome back, {wallet.publicKey.toString().slice(0, 6)}...{wallet.publicKey.toString().slice(-4)}
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 rounded-xl flex items-center gap-2 glass-card"
          >
            <Calendar className="w-4 h-4" style={{ color: "#00FF9C" }} />
            <span style={{ color: "#E8FFF5" }}>{new Date().toLocaleDateString()}</span>
          </motion.div>
        </motion.div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-t-[#00FF9C] border-r-[#1ED760] border-b-transparent border-l-transparent mb-4"
            />
            <p style={{ color: "#7BE3B3" }}>Loading your dashboard...</p>
          </div>
        ) : data ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-6 rounded-2xl relative overflow-hidden glass-card"
              >
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-3xl"
                     style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                         style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
                      <Bot className="w-6 h-6" style={{ color: "#050505" }} />
                    </div>
                    <ArrowUpRight className="w-4 h-4" style={{ color: "#00FF9C" }} />
                  </div>
                  <p className="text-sm mb-1" style={{ color: "#7BE3B3" }}>Agents Deployed</p>
                  <p className="text-3xl font-bold" style={{ color: "#E8FFF5" }}>{data.agents_deployed}</p>
                  <p className="text-xs mt-2" style={{ color: "#00FF9C" }}>+{data.agents_deployed} total</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl relative overflow-hidden glass-card"
              >
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-3xl"
                     style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                         style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
                      <Coins className="w-6 h-6" style={{ color: "#050505" }} />
                    </div>
                    <TrendingUp className="w-4 h-4" style={{ color: "#00FF9C" }} />
                  </div>
                  <p className="text-sm mb-1" style={{ color: "#7BE3B3" }}>Total Earnings</p>
                  <p className="text-3xl font-bold gradient-text">{data.total_earnings} SOL</p>
                  <p className="text-xs mt-2" style={{ color: "#7BE3B3" }}>Lifetime earnings</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl relative overflow-hidden glass-card"
              >
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-3xl"
                     style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                         style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
                      <Zap className="w-6 h-6" style={{ color: "#050505" }} />
                    </div>
                    <Users className="w-4 h-4" style={{ color: "#00FF9C" }} />
                  </div>
                  <p className="text-sm mb-1" style={{ color: "#7BE3B3" }}>Total Runs</p>
                  <p className="text-3xl font-bold" style={{ color: "#E8FFF5" }}>{data.total_runs.toLocaleString()}</p>
                  <p className="text-xs mt-2" style={{ color: "#7BE3B3" }}>Across all agents</p>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card overflow-hidden"
            >
              <div className="px-6 py-4 border-b flex items-center justify-between"
                   style={{ borderColor: "rgba(0, 255, 156, 0.1)" }}>
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5" style={{ color: "#00FF9C" }} />
                  <h2 className="text-xl font-semibold" style={{ color: "#E8FFF5" }}>Your Agents</h2>
                </div>
                <Link href="/deploy">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 glow-green-hover"
                    style={{
                      background: "linear-gradient(135deg, #00FF9C, #1ED760)",
                      color: "#050505"
                    }}
                  >
                    <Bot className="w-4 h-4" />
                    Deploy New Agent
                  </motion.button>
                </Link>
              </div>
              
              {data.agents.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-12 text-center"
                >
                  <div className="w-20 h-20 rounded-full opacity-20 flex items-center justify-center mx-auto mb-4"
                       style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
                    <Bot className="w-10 h-10" style={{ color: "#050505" }} />
                  </div>
                  <p className="text-lg mb-2" style={{ color: "#E8FFF5" }}>No agents deployed yet</p>
                  <p className="text-sm mb-6" style={{ color: "#7BE3B3" }}>
                    Start your journey by deploying your first AI agent on Solana
                  </p>
                  <Link href="/deploy">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 glow-green-hover"
                      style={{
                        background: "linear-gradient(135deg, #00FF9C, #1ED760)",
                        color: "#050505"
                      }}
                    >
                      <Rocket className="w-4 h-4" />
                      Deploy your first agent
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </motion.div>
              ) : (
                <div className="divide-y" style={{ borderColor: "rgba(0, 255, 156, 0.1)" }}>
                  {data.agents.map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ background: "rgba(0, 255, 156, 0.05)" }}
                      className="p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                             style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
                          <Bot className="w-6 h-6" style={{ color: "#050505" }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1" style={{ color: "#E8FFF5" }}>{agent.name}</h3>
                          <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                                  style={{ 
                                    background: "rgba(0, 255, 156, 0.1)",
                                    border: "1px solid rgba(0, 255, 156, 0.2)",
                                    color: "#7BE3B3"
                                  }}>
                              <Bot className="w-3 h-3" />
                              {agent.category}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                                  style={{ 
                                    background: "rgba(0, 255, 156, 0.1)",
                                    border: "1px solid rgba(0, 255, 156, 0.2)",
                                    color: "#7BE3B3"
                                  }}>
                              <Coins className="w-3 h-3" />
                              {agent.price} SOL/run
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                                  style={{ 
                                    background: "rgba(0, 255, 156, 0.1)",
                                    border: "1px solid rgba(0, 255, 156, 0.2)",
                                    color: "#7BE3B3"
                                  }}>
                              <Zap className="w-3 h-3" />
                              {agent.total_runs} runs
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 md:flex-col md:items-end">
                        <div className="text-right">
                          <p className="text-2xl font-bold gradient-text">
                            {(agent.price * agent.total_runs).toFixed(2)} SOL
                          </p>
                          <p className="text-xs" style={{ color: "#7BE3B3" }}>total earned</p>
                        </div>
                        <Link href={`/agent/${agent.id}`}>
                          <motion.button
                            whileHover={{ x: 5 }}
                            className="p-2 rounded-lg glass-card"
                          >
                            <ChevronRight className="w-4 h-4" style={{ color: "#00FF9C" }} />
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 rounded-2xl text-center glass-card"
            style={{ border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <XCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "#EF4444" }} />
            <p className="text-lg" style={{ color: "#EF4444" }}>Error loading dashboard</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}