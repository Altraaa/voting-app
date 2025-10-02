export type Candidate = {
  id: number;
  name: string;
  email: string;
  bio: string;
  event: string;
  category: string;
  votes: number;
  status: "active" | "inactive" | "winner";
  image?: string;
};

export const initialCandidates: Candidate[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    bio: "Outstanding academic performance with 4.0 GPA",
    event: "Best Student Award 2025",
    category: "Academic",
    votes: 342,
    status: "active",
    image: "/candidate-sarah.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    bio: "Exceptional leadership and team collaboration",
    event: "Employee of the Month",
    category: "Corporate",
    votes: 298,
    status: "active",
    image: "/candidate-michael.jpg",
  },
  {
    id: 3,
    name: "Emma Williams",
    email: "emma.williams@example.com",
    bio: "Dedicated community service volunteer",
    event: "Community Leader Election",
    category: "Community",
    votes: 567,
    status: "active",
    image: "/candidate-emma.jpg",
  },
  {
    id: 4,
    name: "David Brown",
    email: "david.brown@example.com",
    bio: "Innovative AI-powered healthcare solution",
    event: "Best Innovation Project",
    category: "Technology",
    votes: 234,
    status: "active",
    image: "/candidate-david.jpg",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    bio: "Three-time MVP with exceptional sportsmanship",
    event: "Sports Team Captain",
    category: "Sports",
    votes: 189,
    status: "winner",
    image: "/candidate-lisa.jpg",
  },
  {
    id: 6,
    name: "James Wilson",
    email: "james.wilson@example.com",
    bio: "Published researcher in quantum computing",
    event: "Best Student Award 2025",
    category: "Academic",
    votes: 276,
    status: "active",
    image: "/candidate-james.jpg",
  },
];
