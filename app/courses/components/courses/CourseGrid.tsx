"use client";

import { getChainId, writeContract } from "@wagmi/core";
import { config } from "@/config/wagmi";
import { useAccount } from "wagmi";
import CourseCard from "./CourseCard";
import * as abiJSON from "@/abi/CourseMarket.json";
import { debounce } from "@/utils";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: string;
  tags: string[];
  stats: {
    modules: number;
    duration: string;
    rewards: number;
  };
  price: string;
  unit?: string;
}

interface CourseGridProps {
  courses: Course[];
}

const CourseGrid = ({ courses }: CourseGridProps) => {
  const { abi, networks } = abiJSON;
  const { address: accountArress, isConnected } = useAccount();
  const chainId = getChainId(config);
  const address = networks[chainId].address;

  const onPurchase = debounce((courseId: string) => {
    try {
      // Add purchase logic here
      console.log(`Purchased course with ID: ${courseId}`);
      const result = writeContract(config, {
        address,
        abi,
        functionName: "purchaseCourse",
        args: [courseId],
      });
      console.log("result: ", result);

    } catch (err) {
      console.error("(●￣(ｴ)￣●) Error purchasing course: ", err);
    }
  }, 500);

  return (
    <div className="grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} onPurchase={onPurchase} {...course} />
      ))}
    </div>
  );
};

export default CourseGrid;
