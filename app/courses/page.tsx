"use client";

import { Suspense, useEffect, useState } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FilterBar from "./components/courses/Filter";
import CourseGrid from "./components/courses/CourseGrid";
import CourseLayout from "./components/CourseLayout";
import CourseDialog from './components/AddCourseModal';
import * as coursesData from "../../mock/courses.json";
import { Course } from "./interfaces";

const filterOptions = [
  { id: "all", label: "All Courses" },
  { id: "smart-contracts", label: "Smart Contracts" },
  { id: "defi", label: "DeFi" },
  { id: "nft", label: "NFT" },
  { id: "gamefi", label: "GameFi" },
];

const Page = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>(coursesData.courses || []);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getAllCourses'
        })
      });
      const { data: { courses } } = await response.json();
      console.log("🚀 ~ fetchCourses ~ data:", courses);
      setCourses(courses);
    } catch (error) {
      console.error('获取课程列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <CourseDialog />
          <Suspense fallback={<div>loading...</div>}>
            <CourseGrid courses={courses} />
          </Suspense>
        </main>
      </div>
    </CourseLayout>
  );
};

export default Page;
