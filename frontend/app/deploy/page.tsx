"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { API_ENDPOINTS, getApiUrl } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Rocket, 
  Wallet, 
  CheckCircle, 
  XCircle,
  Loader2,
  Info,
  ExternalLink,
  Coins,
  FileText,
  Tag,
  Zap,
  Copy,
  ArrowRight,
  Shield,
  Bot
} from "lucide-react";

const connection = new Connection('https://api.devnet.solana.com');
const PLATFORM_FEE_WALLET = new PublicKey("HgTT5LJc7foTqD5LqPZmqFpTaL5QqTQqT6yZnRzKxJQK");

export default function DeployAgent() {
  const wallet = useWallet();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0.1);
  const [category, setCategory] = useState("AI");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionStep, setTransactionStep] = useState<'idle' | 'payment' | 'saving' | 'success' | 'error'>('idle');

  const categories = ["AI", "DeFi", "Data", "Security", "Management", "Content"];

  const handleDeploy = async () => {
    if (!wallet.publicKey) {
      setMessage("❌ Please connect your wallet first!");
      return;
    }

    if (!name || !description || price <= 0) {
      setMessage("❌ Please fill all required fields!");
      return;
    }

    setLoading(true);
    setTransactionStep('payment');
    setMessage("");

    try {
      // STEP 1: Pay deployment fee (0.001 SOL)
      const feeInLamports = 0.001 * LAMPORTS_PER_SOL;
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: PLATFORM_FEE_WALLET,
          lamports: feeInLamports,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      setTransactionStep('saving');

      // STEP 2: Save agent to backend
      const agentData = {
        name: name,
        description: description,
        price: price,
        creator: wallet.publicKey.toString(),
        category: category,
        type: name.toLowerCase().includes('crypto') ? 'crypto' : 
              name.toLowerCase().includes('nft') ? 'nft' :
              name.toLowerCase().includes('twitter') ? 'twitter' : 'blog'
      };

      const response = await fetch(getApiUrl(API_ENDPOINTS.AGENTS), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error: ${errorText}`);
      }

      const savedAgent = await response.json();

      // STEP 3: Show success
      setTransactionStep('success');
      setMessage(`✅ SUCCESS! Agent "${name}" deployed!`);
      
      // Clear form
      setName("");
      setDescription("");
      setPrice(0.1);
      setCategory("AI");
      
    } catch (error: any) {
      console.error("Deploy error:", error);
      setTransactionStep('error');
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (transactionStep === 'success' || transactionStep === 'error') {
          setTransactionStep('idle');
        }
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#050505" }}>
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse" 
             style={{ background: "radial-gradient(circle, #00FF9C 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl animate-pulse" 
             style={{ background: "radial-gradient(circle, #1ED760 0%, transparent 70%)", animationDelay: "2s" }} />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto glow-green"
                 style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
              <Rocket className="w-10 h-10" style={{ color: "#050505" }} />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: "#E8FFF5" }}>
            Deploy Your <span className="gradient-text">AI Agent</span>
          </h1>
          <p className="text-lg" style={{ color: "#7BE3B3" }}>
            Launch your autonomous agent on Solana blockchain
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card overflow-hidden"
        >
          {/* Wallet Status */}
          <div className="p-6 border-b" style={{ borderColor: "rgba(0, 255, 156, 0.1)" }}>
            {!wallet.publicKey ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{ 
                  background: "rgba(255, 193, 7, 0.1)",
                  border: "1px solid rgba(255, 193, 7, 0.2)"
                }}
              >
                <Wallet className="w-5 h-5" style={{ color: "#FFC107" }} />
                <span style={{ color: "#FFC107" }}>⚠️ Please connect your wallet first</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                       style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
                    <CheckCircle className="w-5 h-5" style={{ color: "#050505" }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "#7BE3B3" }}>Connected Wallet</p>
                    <p className="font-mono text-sm" style={{ color: "#E8FFF5" }}>
                      {wallet.publicKey.toString().slice(0, 8)}...{wallet.publicKey.toString().slice(-8)}
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#00FF9C" }}
                />
              </motion.div>
            )}
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Agent Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: "#7BE3B3" }}>
                <Tag className="w-4 h-4" style={{ color: "#00FF9C" }} />
                Agent Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Crypto Trading Assistant"
                className="w-full p-4 rounded-xl glass-card transition-all focus:glow-green"
                style={{ 
                  background: "#050505",
                  border: "1px solid rgba(0, 255, 156, 0.2)",
                  color: "#E8FFF5",
                  outline: "none"
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: "#7BE3B3" }}>
                <FileText className="w-4 h-4" style={{ color: "#00FF9C" }} />
                Description *
              </label>
              <textarea
                placeholder="Describe what your agent does..."
                className="w-full p-4 rounded-xl glass-card transition-all focus:glow-green"
                style={{ 
                  background: "#050505",
                  border: "1px solid rgba(0, 255, 156, 0.2)",
                  color: "#E8FFF5",
                  outline: "none"
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                disabled={loading}
              />
            </motion.div>

            {/* Category */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: "#7BE3B3" }}>
                <Bot className="w-4 h-4" style={{ color: "#00FF9C" }} />
                Category *
              </label>
              <select
                className="w-full p-4 rounded-xl glass-card transition-all focus:glow-green"
                style={{ 
                  background: "#050505",
                  border: "1px solid rgba(0, 255, 156, 0.2)",
                  color: "#E8FFF5",
                  outline: "none"
                }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} style={{ background: "#050505" }}>
                    {cat}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: "#7BE3B3" }}>
                <Coins className="w-4 h-4" style={{ color: "#00FF9C" }} />
                Price (in SOL) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.1"
                  className="w-full p-4 rounded-xl glass-card transition-all focus:glow-green"
                  style={{ 
                    background: "#050505",
                    border: "1px solid rgba(0, 255, 156, 0.2)",
                    color: "#E8FFF5",
                    outline: "none"
                  }}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  disabled={loading}
                  step="0.01"
                  min="0.01"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm" style={{ color: "#7BE3B3" }}>
                  SOL
                </span>
              </div>
            </motion.div>

            {/* Deploy Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={handleDeploy}
                disabled={loading || !wallet.publicKey}
                whileHover={!(loading || !wallet.publicKey) ? { scale: 1.02 } : {}}
                whileTap={!(loading || !wallet.publicKey) ? { scale: 0.98 } : {}}
                className="w-full py-4 rounded-xl font-bold text-lg relative overflow-hidden glow-green-hover"
                style={{
                  background: !wallet.publicKey ? "#475569" :
                             "linear-gradient(135deg, #00FF9C, #1ED760)",
                  color: "#050505",
                  opacity: (loading || !wallet.publicKey) ? 0.5 : 1,
                  cursor: (loading || !wallet.publicKey) ? "not-allowed" : "pointer"
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {transactionStep === 'payment' ? 'PROCESSING PAYMENT...' : 
                       transactionStep === 'saving' ? 'SAVING AGENT...' : 
                       'DEPLOYING...'}
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      DEPLOY AGENT (0.001 SOL fee)
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>

            {/* Transaction Steps */}
            <AnimatePresence>
              {transactionStep !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl space-y-3" style={{ background: "#050505" }}>
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ scale: transactionStep === 'payment' ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 1, repeat: transactionStep === 'payment' ? Infinity : 0 }}
                      >
                        {transactionStep === 'payment' && <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#00FF9C" }} />}
                        {transactionStep === 'saving' && <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#1ED760" }} />}
                        {transactionStep === 'success' && <CheckCircle className="w-5 h-5" style={{ color: "#00FF9C" }} />}
                        {transactionStep === 'error' && <XCircle className="w-5 h-5" style={{ color: "#EF4444" }} />}
                      </motion.div>
                      <span style={{ 
                        color: transactionStep === 'payment' ? "#00FF9C" :
                               transactionStep === 'saving' ? "#1ED760" :
                               transactionStep === 'success' ? "#00FF9C" :
                               transactionStep === 'error' ? "#EF4444" :
                               "#7BE3B3"
                      }}>
                        {transactionStep === 'payment' && "Processing payment on Solana..."}
                        {transactionStep === 'saving' && "Saving agent to marketplace..."}
                        {transactionStep === 'success' && "Agent deployed successfully!"}
                        {transactionStep === 'error' && "Deployment failed"}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {(transactionStep === 'payment' || transactionStep === 'saving') && (
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-1 rounded-full"
                        style={{ 
                          background: "linear-gradient(90deg, #00FF9C, #1ED760)",
                          opacity: 0.5
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success/Error Message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="rounded-xl overflow-hidden glass-card"
                  style={{ 
                    border: `2px solid ${message.includes('✅') ? '#00FF9C' : '#EF4444'}`,
                  }}
                >
                  <div 
                    className="p-4"
                    style={{ 
                      background: message.includes('✅') ? "rgba(0, 255, 156, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      borderBottom: `1px solid ${message.includes('✅') ? '#00FF9C' : '#EF4444'}`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {message.includes('✅') ? (
                        <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: "#00FF9C" }} />
                      ) : (
                        <XCircle className="w-6 h-6 flex-shrink-0" style={{ color: "#EF4444" }} />
                      )}
                      <h3 className="font-bold text-lg" style={{ 
                        color: message.includes('✅') ? "#00FF9C" : "#EF4444" 
                      }}>
                        {message.includes('✅') ? 'Deployment Successful!' : 'Deployment Failed'}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="text-base" style={{ color: "#E8FFF5" }}>
                      {message}
                    </p>

                    {message.includes('✅') && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href="/marketplace"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium glow-green-hover"
                          style={{ 
                            background: "linear-gradient(135deg, #00FF9C, #1ED760)",
                            color: "#050505"
                          }}
                        >
                          <ArrowRight className="w-4 h-4" />
                          Go to Marketplace
                        </Link>
                      </div>
                    )}

                    {message.includes('❌') && (
                      <button
                        onClick={() => setMessage("")}
                        className="w-full px-4 py-2.5 rounded-lg text-sm font-medium"
                        style={{ 
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          color: "#EF4444"
                        }}
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-6 rounded-xl glass-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5" style={{ color: "#00FF9C" }} />
                <h3 className="font-bold" style={{ color: "#E8FFF5" }}>How it works</h3>
              </div>
              
              <ul className="space-y-3">
                {[
                  "You pay 0.001 SOL deployment fee",
                  "Agent is saved in our marketplace",
                  "Appears instantly for users to discover",
                  "When users run your agent, they pay YOU directly"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                         style={{ background: "linear-gradient(135deg, #00FF9C, #1ED760)" }}>
                      <Zap className="w-3 h-3" style={{ color: "#050505" }} />
                    </div>
                    <span className="text-sm" style={{ color: "#7BE3B3" }}>{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="p-3 rounded-lg text-center" 
                  style={{ background: "#050505" }}
                >
                  <p className="text-xs" style={{ color: "#7BE3B3" }}>Fee</p>
                  <p className="font-bold gradient-text">0.001 SOL</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="p-3 rounded-lg text-center" 
                  style={{ background: "#050505" }}
                >
                  <p className="text-xs" style={{ color: "#7BE3B3" }}>Network</p>
                  <p className="font-bold" style={{ color: "#00FF9C" }}>Devnet</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="p-3 rounded-lg text-center" 
                  style={{ background: "#050505" }}
                >
                  <p className="text-xs" style={{ color: "#7BE3B3" }}>Security</p>
                  <p className="font-bold flex items-center justify-center gap-1" style={{ color: "#00FF9C" }}>
                    <Shield className="w-3 h-3" />
                    Secure
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6 text-sm"
          style={{ color: "#7BE3B3" }}
        >
          Deploy once, earn forever • Powered by Solana
        </motion.p>
      </div>
    </div>
  );
}