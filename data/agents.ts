import { Agent } from "../types/agent";

export const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Crypto Research Agent",
    description: "Analyzes tokenomics, sentiment, and trends of crypto tokens.",
    price: 0.1,
    creator: "9Xf...abc",
    endpoint: "/api/execute/crypto",
    rating: 4.5,
  },
  {
    id: "2",
    name: "NFT Analysis Agent",
    description: "Evaluates NFT collections for floor price, volume, and holders.",
    price: 0.08,
    creator: "3Gh...xyz",
    endpoint: "/api/execute/nft",
    rating: 4.2,
  },
  {
    id: "3",
    name: "Twitter Growth Agent",
    description: "Generates tweet ideas and growth strategy for projects.",
    price: 0.05,
    creator: "2Kj...lmn",
    endpoint: "/api/execute/twitter",
    rating: 4.0,
  },
];