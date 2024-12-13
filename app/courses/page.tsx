"use client";

import { useState } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FilterBar from "./components/courses/Filter";
import CourseGrid from "./components/courses/CourseGrid";
import CourseLayout from "./components/CourseLayout";
import { useImmer } from "@/hooks/useImmer";

const filterOptions = [
  { id: "all", label: "All Courses" },
  { id: "smart-contracts", label: "Smart Contracts" },
  { id: "defi", label: "DeFi" },
  { id: "nft", label: "NFT" },
  { id: "gamefi", label: "GameFi" },
];

const coursesData = [
  {
    id: "1",
    title: "Solidity Fundamentals",
    description:
      "Learn the basics of smart contract development with Solidity.",
    image: "/path-to-image.jpg",
    difficulty: "Beginner",
    tags: ["Solidity", "Smart Contracts"],
    stats: {
      modules: 8,
      duration: "6 Hours",
      rewards: 3,
    },
    price: "100",
  },
  {
    id: "2",
    title: "DeFi Protocol Development",
    description: "Build decentralized finance applications from scratch.",
    image: "/path-to-image.jpg",
    difficulty: "Advanced",
    tags: ["DeFi", "Smart Contracts", "Solidity"],
    stats: {
      modules: 12,
      duration: "10 Hours",
      rewards: 5,
    },
    price: "20",
  },
  {
    id: "3",
    title: "Web3.js & Ethers.js Mastery",
    description:
      "Master the essential JavaScript libraries for blockchain development.",
    image: "/path-to-image.jpg",
    difficulty: "Intermediate",
    tags: ["JavaScript", "Web3", "Ethers.js"],
    stats: {
      modules: 6,
      duration: "5 Hours",
      rewards: 2,
    },
    price: "30",
  },
  {
    id: "4",
    title: "NFT Smart Contract Development",
    description: "Learn to create, deploy and integrate NFT smart contracts.",
    image: "/path-to-image.jpg",
    difficulty: "Intermediate",
    tags: ["NFT", "ERC721", "Solidity"],
    stats: {
      modules: 10,
      duration: "8 Hours",
      rewards: 4,
    },
    price: "50",
  },
  {
    id: "5",
    title: "Blockchain Security Fundamentals",
    description:
      "Understanding common vulnerabilities and security best practices.",
    image: "/path-to-image.jpg",
    difficulty: "Advanced",
    tags: ["Security", "Smart Contracts", "Auditing"],
    stats: {
      modules: 15,
      duration: "12 Hours",
      rewards: 6,
    },
    price: "88",
  },
  {
    id: "6",
    title: "React & Web3 Integration",
    description: "Build modern dApp frontends with React and Web3.",
    image: "/path-to-image.jpg",
    difficulty: "Intermediate",
    tags: ["React", "Web3", "dApps"],
    stats: {
      modules: 9,
      duration: "7 Hours",
      rewards: 3,
    },
    price: "125",
  },
  {
    id: "7",
    title: "Zero Knowledge Proofs",
    description:
      "Deep dive into ZK-SNARKs and privacy-preserving applications.",
    image: "/path-to-image.jpg",
    difficulty: "Expert",
    tags: ["ZK-Proofs", "Privacy", "Cryptography"],
    stats: {
      modules: 14,
      duration: "15 Hours",
      rewards: 7,
    },
    price: "5",
  },
  {
    id: "8",
    title: "Layer 2 Development",
    description: "Build and deploy applications on Layer 2 networks.",
    image: "/path-to-image.jpg",
    difficulty: "Advanced",
    tags: ["Layer2", "Scaling", "Optimism"],
    stats: {
      modules: 11,
      duration: "9 Hours",
      rewards: 5,
    },
    price: "15",
  },
];

const Page = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <CourseLayout>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <HeroSection />
          <FilterBar
            options={filterOptions}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <CourseGrid courses={coursesData} />
        </main>
      </div>
    </CourseLayout>
  );
};

export default Page;
