"use client";

import React from "react";
import { hooks } from "@/connections/metaMask";

const { useAccounts } = hooks;

const CourseCard = ({
  course,
  isPurchased,
  handleApproveAndPurchaseUnified,
}: {
  course: {
    creator: string;
    web2CourseId: string;
    price: string;
    isActive: boolean;
    name: string;
  };
  isPurchased: boolean;
  handleApproveAndPurchaseUnified?: (key: string) => void;
}) => {
  const accounts = useAccounts(); // 获取当前钱包地址
  const currentAccount = accounts?.[0]; // 获取第一个钱包地址
  const isOwner =
    course.creator.toLowerCase() === currentAccount?.toLowerCase();

  return (
    <div
      key={course.web2CourseId}
      className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden"
    >
      {/* 图片区域 */}
      <div className="bg-gray-300 h-48 flex items-center justify-center text-gray-500 text-3xl overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transform transition-transform duration-500 hover:scale-110"
          style={{
            backgroundImage: `url('https://picsum.photos/400/300?random=${Math.random()}')`,
          }}
        ></div>
      </div>

      {/* 文字描述区域 */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{course.name}</h3>
        <p className="text-gray-400 text-sm">
          Collected on {new Date().toLocaleDateString()}
        </p>
        <div className="mt-4 flex justify-between text-gray-300 text-sm">
          <span>Price: {course.price} YD</span>
          <span>Active: {course.isActive ? "Yes" : "No"}</span>
        </div>
        <div className="mt-2 text-sm">
          <span className="text-gray-400">Creator: </span>
          {course.creator}
        </div>

        {/* 购买按钮或占位信息 */}
        <div className="mt-4">
          {isOwner ? (
            <span className="text-green-500 font-semibold">
              This is your update course
            </span>
          ) : (
            <button
              onClick={() =>
                handleApproveAndPurchaseUnified?.(course.web2CourseId)
              }
              disabled={isPurchased}
              className={`w-full font-bold py-2 px-4 rounded ${
                isPurchased
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isPurchased ? "Purchased" : "Buy Now"}
            </button>
          )}
        </div>
      </div>
      {/* 购物车图标 */}
      <div className=" fixed bottom-4 right-4 z-50" id="shopping-cart">
        <div className="relative">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386a.75.75 0 01.71.518l3.021 9.064a1.5 1.5 0 001.426 1.018h8.698a1.5 1.5 0 001.426-1.018l2.25-6.75a.75.75 0 00-.711-.982H6.75m0 0L5.613 3.518A.75.75 0 004.905 3H2.25m4.5 0h12.75M9 20.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
              />
            </svg>
          </div>
          {/* {cartCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </div>
          )} */}
        </div>
      </div>
      {/* {isAnimating && (
        <div
          className="absolute z-50 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out"
          style={flyIconStyle as React.CSSProperties}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386a.75.75 0 01.71.518l3.021 9.064a1.5 1.5 0 001.426 1.018h8.698a1.5 1.5 0 001.426-1.018l2.25-6.75a.75.75 0 00-.711-.982H6.75m0 0L5.613 3.518A.75.75 0 004.905 3H2.25m4.5 0h12.75M9 20.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
            />
          </svg>
        </div>
      )} */}
    </div>
  );
};

export default CourseCard;
