"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { API_ENDPOINTS, getApiUrl } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Star, 
  Wallet, 
  User, 
  Zap, 
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Rocket,
  TrendingUp,
  Copy,
  Send,
  Award,
  Bot
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

const connection = new Connection('https://api.devnet.solana.com');

export default function AgentDetail() {
  const params = useParams();
  const wallet = useWallet();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setFetchLoading(true);
        const response = await fetch(getApiUrl(`/agents/${params.id}`));
        
        if (!response.ok) {
          throw new Error('Agent not found');
        }
        
        const data = await response.json();
        setAgent(data);
        
      } catch (error) {
        console.error("Error fetching agent:", error);
        setAgent(null);
      } finally {
        setFetchLoading(false);
      }
    };

    if (params.id) {
      fetchAgent();
    }
  }, [params.id]);

  useEffect(() => {
    const getBalance = async () => {
      if (!wallet.publicKey) return;
      try {
        const bal = await connection.getBalance(wallet.publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    
    getBalance();
    const interval = setInterval(getBalance, 10000);
    return () => clearInterval(interval);
  }, [wallet.publicKey]);

  const isValidSolanaAddress = (address: string) => {
    return address && address.length >= 32 && address.length <= 44;
  };

  const shortenAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAgent = async () => {
    if (!wallet.publicKey) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!agent) {
      alert("Agent not found!");
      return;
    }

    if (!input.trim()) {
      alert("Please enter some input for the agent!");
      return;
    }

    const priceInLamports = agent.price * LAMPORTS_PER_SOL;
    if (balance !== null && balance < agent.price) {
      alert(`You need ${agent.price} SOL but you only have ${balance.toFixed(4)} SOL`);
      return;
    }

    setLoading(true);
    setTransactionStatus('processing');
    setOutput("");

    try {
      if (!isValidSolanaAddress(agent.creator)) {
        throw new Error(`Invalid creator address: ${agent.creator}`);
      }
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(agent.creator),
          lamports: priceInLamports,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      setTransactionStatus('success');

      const response = await fetch(getApiUrl(API_ENDPOINTS.EXECUTE_AGENT), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_type: agent.id.split('_')[0],
          input: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      setOutput(data.result);
      setShowRating(true);
      setRatingSubmitted(false);

    } catch (error: any) {
      console.error("Error:", error);
      setTransactionStatus('error');
      setOutput(error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (rating: number) => {
    if (!wallet.publicKey || !agent) return;
    
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.RATE_AGENT), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agent.id,
          rating: rating,
          wallet: wallet.publicKey.toString(),
        }),
      });
      
      if (response.ok) {
        setRatingSubmitted(true);
        setUserRating(rating);
        setShowRating(false);
        
        const agentsResponse = await fetch(getApiUrl(API_ENDPOINTS.AGENTS));
        const agents = await agentsResponse.json();
        const updated = agents.find((a: Agent) => a.id === agent.id);
        if (updated) setAgent(updated);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050505" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-t-[#00FF9C] border-r-[#1ED760] border-b-transparent border-l-transparent mx-auto mb-4"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Bot className="w-6 h-6" style={{ color: "#00FF9C" }} />
            </motion.div>
          </div>
          <p className="text-lg" style={{ color: "#7BE3B3" }}>Loading agent details...</p>
        </motion.div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050505" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8 rounded-2xl glass-card"
        >
          <XCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "#EF4444" }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#E8FFF5" }}>Agent Not Found</h1>
          <p className="mb-6" style={{ color: "#7BE3B3" }}>The agent you're looking for doesn't exist or has been removed.</p>
          <Link href="/marketplace">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto glow-green-hover"
              style={{
                background: "linear-gradient(135deg, #00FF9C, #1ED760)",
                color: "#050505"
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </motion.button>
          </Link>
        </motion.div>
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

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/marketplace">
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all glass-card"
              style={{ color: "#7BE3B3" }}
            >
              <ArrowLeft className="w-4 h-4" style={{ color: "#00FF9C" }} />
              Back to Marketplace
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-8 border-b" style={{ borderColor: "rgba(0, 255, 156, 0.1)" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span 
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs mb-3"
                  style={{ 
                    background: "rgba(0, 255, 156, 0.1)",
                    border: "1px solid rgba(0, 255, 156, 0.2)",
                    color: "#00FF9C"
                  }}
                >
                  <Bot className="w-3 h-3" />
                  {agent.category}
                </span>
                <h1 className="text-4xl font-bold mb-2" style={{ color: "#E8FFF5" }}>
                  {agent.name}
                </h1>
                <p className="text-lg" style={{ color: "#7BE3B3" }}>{agent.description}</p>
              </div>
              
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center glow-green"
                style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}
              >
                <Zap className="w-10 h-10" style={{ color: "#050505" }} />
              </motion.div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-xl" style={{ background: "#050505" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4" style={{ color: "#00FF9C" }} />
                  <span className="text-xs" style={{ color: "#7BE3B3" }}>Price</span>
                </div>
                <p className="text-xl font-bold gradient-text">{agent.price} SOL</p>
              </div>

              <div className="p-4 rounded-xl" style={{ background: "#050505" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4" style={{ color: "#00FF9C" }} fill="#00FF9C" />
                  <span className="text-xs" style={{ color: "#7BE3B3" }}>Rating</span>
                </div>
                <p className="text-xl font-bold" style={{ color: "#E8FFF5" }}>{agent.rating}/5.0</p>
              </div>

              <div className="p-4 rounded-xl" style={{ background: "#050505" }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4" style={{ color: "#00FF9C" }} />
                  <span className="text-xs" style={{ color: "#7BE3B3" }}>Total Runs</span>
                </div>
                <p className="text-xl font-bold" style={{ color: "#E8FFF5" }}>{agent.total_runs.toLocaleString()}</p>
              </div>

              <div className="p-4 rounded-xl" style={{ background: "#050505" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4" style={{ color: "#00FF9C" }} />
                  <span className="text-xs" style={{ color: "#7BE3B3" }}>Created</span>
                </div>
                <p className="text-sm font-bold" style={{ color: "#E8FFF5" }}>
                  {new Date(agent.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl flex items-center justify-between" style={{ background: "#050505" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                     style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
                  <User className="w-5 h-5" style={{ color: "#050505" }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#7BE3B3" }}>Creator</p>
                  <p className="font-mono text-sm" style={{ color: "#E8FFF5" }}>{shortenAddress(agent.creator)}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(agent.creator)}
                className="p-2 rounded-lg transition-all glow-green-hover"
                style={{ 
                  background: "rgba(0, 255, 156, 0.1)",
                  border: "1px solid rgba(0, 255, 156, 0.2)"
                }}
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4" style={{ color: "#00FF9C" }} />
                ) : (
                  <Copy className="w-4 h-4" style={{ color: "#00FF9C" }} />
                )}
              </button>
            </div>

            {wallet.publicKey && balance !== null && balance < agent.price && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-lg flex items-center gap-2"
                style={{ 
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)"
                }}
              >
                <XCircle className="w-4 h-4" style={{ color: "#EF4444" }} />
                <span className="text-sm" style={{ color: "#F87171" }}>
                  Insufficient balance. You have {balance.toFixed(4)} SOL but need {agent.price} SOL
                </span>
              </motion.div>
            )}
          </div>

          <div className="p-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#E8FFF5" }}>Run Agent</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#7BE3B3" }}>
                  Enter your task
                </label>
                <textarea
                  className="w-full p-4 rounded-xl glass-card transition-all focus:glow-green"
                  style={{ 
                    background: "#050505",
                    border: "1px solid rgba(0, 255, 156, 0.2)",
                    color: "#E8FFF5",
                    outline: "none"
                  }}
                  placeholder={`e.g., ${agent.id.includes('crypto') ? 'Analyze Solana price trends' : 
                    agent.id.includes('nft') ? 'Analyze Bored Ape Yacht Club collection' :
                    agent.id.includes('twitter') ? 'Create a growth strategy for my Web3 project' :
                    'Write about AI and blockchain integration'}`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={4}
                  disabled={loading}
                />
              </div>

              <motion.button
                onClick={handleRunAgent}
                disabled={loading || !wallet.publicKey || (balance !== null && balance < agent.price)}
                whileHover={!(loading || !wallet.publicKey || (balance !== null && balance < agent.price)) ? { scale: 1.02 } : {}}
                whileTap={!(loading || !wallet.publicKey || (balance !== null && balance < agent.price)) ? { scale: 0.98 } : {}}
                className="w-full py-4 rounded-xl font-bold text-lg relative overflow-hidden glow-green-hover"
                style={{
                  background: !wallet.publicKey ? "#475569" :
                             (balance !== null && balance < agent.price) ? "#475569" :
                             "linear-gradient(135deg, #00FF9C, #1ED760)",
                  color: "#050505",
                  opacity: (loading || !wallet.publicKey || (balance !== null && balance < agent.price)) ? 0.5 : 1,
                  cursor: (loading || !wallet.publicKey || (balance !== null && balance < agent.price)) ? "not-allowed" : "pointer"
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      PROCESSING...
                    </>
                  ) : !wallet.publicKey ? (
                    <>
                      <Wallet className="w-5 h-5" />
                      CONNECT WALLET FIRST
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      RUN AGENT ({agent.price} SOL)
                    </>
                  )}
                </span>
              </motion.button>

              <AnimatePresence>
                {transactionStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4 p-4 rounded-xl glass-card"
                    style={{ 
                      border: `1px solid ${
                        transactionStatus === 'success' ? "#00FF9C" :
                        transactionStatus === 'error' ? "#EF4444" :
                        "#00FF9C"
                      }`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {transactionStatus === 'processing' && (
                        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#00FF9C" }} />
                      )}
                      {transactionStatus === 'success' && (
                        <CheckCircle className="w-5 h-5" style={{ color: "#00FF9C" }} />
                      )}
                      {transactionStatus === 'error' && (
                        <XCircle className="w-5 h-5" style={{ color: "#EF4444" }} />
                      )}
                      <span style={{ 
                        color: transactionStatus === 'success' ? "#00FF9C" :
                               transactionStatus === 'error' ? "#EF4444" :
                               "#00FF9C"
                      }}>
                        {transactionStatus === 'processing' && "Processing transaction..."}
                        {transactionStatus === 'success' && "Payment confirmed! Running AI agent..."}
                        {transactionStatus === 'error' && "Transaction failed"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {output && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 p-6 rounded-xl whitespace-pre-wrap font-mono text-sm glass-card"
                    style={{ 
                      border: `1px solid ${
                        transactionStatus === 'success' ? "#00FF9C" :
                        transactionStatus === 'error' ? "#EF4444" :
                        "#00FF9C"
                      }`,
                      color: transactionStatus === 'success' ? "#00FF9C" :
                             transactionStatus === 'error' ? "#EF4444" :
                             "#7BE3B3"
                    }}
                  >
                    {output}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showRating && !ratingSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 p-6 rounded-xl glass-card"
                    style={{ border: "1px solid rgba(0, 255, 156, 0.2)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-5 h-5" style={{ color: "#00FF9C" }} />
                      <h3 className="font-bold" style={{ color: "#E8FFF5" }}>Rate this agent</h3>
                    </div>
                    <p className="text-sm mb-4" style={{ color: "#7BE3B3" }}>
                      How was your experience with {agent.name}?
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => submitRating(star)}
                          className="text-3xl transition-all"
                          style={{ 
                            color: star <= userRating ? "#00FF9C" : "#64748B",
                            filter: star <= userRating ? "drop-shadow(0 0 5px #00FF9C)" : "none"
                          }}
                          disabled={ratingSubmitted}
                        >
                          {star <= userRating ? "★" : "☆"}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {ratingSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4 p-4 rounded-xl flex items-center gap-2 glass-card"
                    style={{ border: "1px solid rgba(0, 255, 156, 0.2)" }}
                  >
                    <CheckCircle className="w-5 h-5" style={{ color: "#00FF9C" }} />
                    <span style={{ color: "#00FF9C" }}>
                      You rated this agent {userRating} stars! Thank you for your feedback!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}