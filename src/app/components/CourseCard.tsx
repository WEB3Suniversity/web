"use client";

import { cn, formatDate } from "@/utils";
import { UserPlus, ShoppingBasket, AArrowUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Skeleton } from "@/app/components/ui/skeleton";
import ConfettiButton from "@/app/components/ui/ConfettiButton";
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
    <li className="course-card group relative overflow-hidden list-none">
      {/* 日期和浏览量 */}
      <div className="flex-between mb-4">
        <p className="course-card_date text-dark-lighter">
          {new Date().toLocaleDateString()}
        </p>
        <div className="mt-4 flex justify-between text-gray-300 text-sm"></div>
        <div className="flex items-center gap-1.5">
          <UserPlus className="size-5 text-primary" />
          <span className="text-16-medium group-hover:text-primary/60 transition-colors">
            Price: {course.price} YD
          </span>
        </div>
      </div>

      {/* 标题 */}
      <Link
        href={`/course/${1}`}
        className="block hover:text-primary transition-colors mb-4"
      >
        <h3 className="course-title text-26-semibold line-clamp-1 text-dark-DEFAULT hover:text-primary">
          {course.name}
        </h3>
      </Link>

      {/* 课程描述和图片 */}
      <Link href={`/course/${1}`} className="block group mb-4">
        <p className="course-card_desc mb-3">{course.creator}</p>

        <div
          style={{
            backgroundImage: `url('https://picsum.photos/400/300?random=${Math.random()}')`,
          }}
          className="relative course-card_img group-hover:scale-105 transition-transform duration-300"
        >
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-[10px]"></div>
        </div>
      </Link>

      {/* 底部分类和详情按钮 */}
      <div className="flex-between mt-4">
        <Button className="course-card_btn group/button">
          {/* 使用图标组件 */}
          <ConfettiButton className="flex items-center gap-2 bg-black text-white hover:bg-primary-dark px-4 py-2 rounded-full">
            <AArrowUp className="h-4 w-4" />
            <span>Approve</span>
          </ConfettiButton>
        </Button>

        <Button className="course-card_btn group/button">
          {/* 使用图标组件 */}
          <ConfettiButton
            className="flex items-center gap-2 bg-black text-white hover:bg-primary-dark px-4 py-2 rounded-full"
            confettiText="Bought!"
          >
            <ShoppingBasket
              className={`h-4 w-4  ${
                isPurchased ? "text-gray-500 cursor-not-allowed" : " "
              }`}
              onClick={() => {
                if (isPurchased) {
                  handleApproveAndPurchaseUnified?.(course.web2CourseId);
                }
              }}
            />
            <span
              className={` ${
                isPurchased ? "text-gray-500 cursor-not-allowed" : " "
              }`}
            >
              {isPurchased ? "Purchased" : "Buy Now"}
            </span>
          </ConfettiButton>
        </Button>
      </div>
    </li>
  );
};

export const CourseCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li
        key={cn("skeleton", index)}
        className="course-card_skeleton animate-pulse"
      >
        <Skeleton className="w-full h-full" />
      </li>
    ))}
  </>
);

export default CourseCard;
