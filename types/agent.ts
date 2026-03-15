export interface Agent {
  id: string;
  name: string;
  description: string;
  price: number; // SOL
  creator: string; // wallet address
  endpoint: string; // API URL (mock for now)
  rating: number; // 0-5
}