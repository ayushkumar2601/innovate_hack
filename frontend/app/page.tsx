"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState, useMemo } from "react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import WalletButton from "../components/WalletButton";
import AgentCard from "../components/AgentCard";
import { motion } from "framer-motion";
import {
    Bot,
    Zap,
    Users,
    DollarSign,
    TrendingUp,
    Rocket,
    Shield,
    ArrowRight,
    CheckCircle,
    Star
} from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "../lib/config";

interface Agent {
  id: string;
  name: string;
  description: string;
  price: number;
  creator: string;
  rating: number;
  total_runs: number;
  category: string;
}

interface Stats {
  total_agents: number;
  total_runs: number;
  total_earnings: number;
  total_creators: number;
}

export default function Home() {
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);

    const connection = useMemo(() => new Connection("https://api.devnet.solana.com"), []);

    useEffect(() => {
        const getBalance = async () => {
            if (!publicKey) return;
            setIsLoading(true);
            try {
                const lamports = await connection.getBalance(publicKey);
                setBalance(lamports / LAMPORTS_PER_SOL);
            } finally {
                setIsLoading(false);
            }
        };
        getBalance();
    }, [publicKey, connection]);

    useEffect(() => {
        // Fetch featured agents
        const fetchAgents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/agents`);
                const data = await response.json();
                setAgents(data.slice(0, 3)); // Show top 3 agents
            } catch (error) {
                console.error("Error fetching agents:", error);
            }
        };

        // Fetch platform stats
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/stats`);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchAgents();
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen" style={{ background: "#050505" }}>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse" 
                         style={{ background: "radial-gradient(circle, #00FF9C 0%, transparent 70%)" }} />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse" 
                         style={{ background: "radial-gradient(circle, #1ED760 0%, transparent 70%)", animationDelay: "2s" }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-bold mb-6" style={{ color: "#E8FFF5" }}>
                            Autonomous AI
                            <br />
                            <span className="gradient-text">Agent Marketplace</span>
                        </h1>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
                            style={{ color: "#7BE3B3" }}
                        >
                            Discover, deploy and monetize autonomous AI agents on the Solana blockchain
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Link href="/marketplace">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 glow-green-hover"
                                    style={{
                                        background: "linear-gradient(135deg, #00FF9C, #1ED760)",
                                        color: "#050505"
                                    }}
                                >
                                    <Bot className="w-5 h-5" />
                                    Explore Agents
                                </motion.button>
                            </Link>
                            
                            <Link href="/deploy">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 glass-card glow-green-hover"
                                    style={{ color: "#00FF9C" }}
                                >
                                    <Rocket className="w-5 h-5" />
                                    Deploy Agent
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                                {stats?.total_agents || "12"}
                            </div>
                            <div style={{ color: "#7BE3B3" }}>Agents Deployed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                                {stats?.total_runs || "1.2k"}
                            </div>
                            <div style={{ color: "#7BE3B3" }}>Total Executions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                                {stats?.total_creators || "8"}
                            </div>
                            <div style={{ color: "#7BE3B3" }}>Active Creators</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                                {stats?.total_earnings?.toFixed(1) || "2.4"} SOL
                            </div>
                            <div style={{ color: "#7BE3B3" }}>Revenue Generated</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Agents */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#E8FFF5" }}>
                            Featured <span className="gradient-text">Agents</span>
                        </h2>
                        <p className="text-xl" style={{ color: "#7BE3B3" }}>
                            Discover the most popular AI agents in our marketplace
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {agents.map((agent, index) => (
                            <motion.div
                                key={agent.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                            >
                                <AgentCard agent={agent} />
                            </motion.div>
                        ))}
                    </div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-center mt-12"
                    >
                        <Link href="/marketplace">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto glass-card glow-green-hover"
                                style={{ color: "#00FF9C" }}
                            >
                                View All Agents
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#E8FFF5" }}>
                            How It <span className="gradient-text">Works</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Bot,
                                title: "Create Agent",
                                description: "Build your AI agent with custom capabilities and intelligence"
                            },
                            {
                                icon: Rocket,
                                title: "Deploy Agent",
                                description: "Launch your agent on the Solana blockchain marketplace"
                            },
                            {
                                icon: DollarSign,
                                title: "Earn Revenue",
                                description: "Monetize your agent as users execute it for their tasks"
                            }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center glass-card glow-green">
                                    <step.icon className="w-10 h-10" style={{ color: "#00FF9C" }} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4" style={{ color: "#E8FFF5" }}>
                                    {step.title}
                                </h3>
                                <p style={{ color: "#7BE3B3" }}>
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="glass-card p-12 glow-green"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "#E8FFF5" }}>
                            Ready to automate your <span className="gradient-text">future?</span>
                        </h2>
                        <p className="text-xl mb-8" style={{ color: "#7BE3B3" }}>
                            Join the autonomous AI revolution on Solana
                        </p>
                        <Link href="/marketplace">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 mx-auto glow-green-hover"
                                style={{
                                    background: "linear-gradient(135deg, #00FF9C, #1ED760)",
                                    color: "#050505"
                                }}
                            >
                                <Zap className="w-5 h-5" />
                                Get Started
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}