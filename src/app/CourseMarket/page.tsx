"use client";

import { useCallback, useEffect, useState } from "react";
import { Eip1193Provider, ethers } from "ethers";
import { CONTRACT_ABI } from "@/utils/CONTRACT_ABI";
// import { BigInt } from "ethers"; // 正确导入 BigNumber
// 请替换为您的YD代币地址和ABI
import { YD_TOKEN_ABI } from "@/utils/YiDengToKen_ABI";
import { hooks, metaMaskStore } from "@/connections/metaMask";
import {
  CONTRACT_ADDRESS,
  generateNftMetadata,
  isClient,
  NFT_CONTRACT_ADDRESS,
  YD_TOKEN_ADDRESS,
} from "@/utils";
import CourseCard from "@/app/components/CourseCard";
import { NFT_ABI } from "@/utils/NFT_ABI";
import SectionHeader from "@/components/SectionHeader";
import CourseDialog from "./Components/CourseModel";

interface Course {
  web2CourseId: string;
  name: string;
  price: string;
  isActive: boolean;
  creator: string;
}

const { useIsActive } = hooks;

export default function CourseMarketPage() {
  // const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  // const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [courseContract, setContract] = useState<ethers.Contract | null>(null);
  const [ydTokenContract, setYdTokenContract] =
    useState<ethers.Contract | null>(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [courseCount, setCourseCount] = useState<number>(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);

  const [newWeb2Id, setNewWeb2Id] = useState("");
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState<string>("");
  const isActive = useIsActive();

  useEffect(() => {
    if (isClient()) {
      const init = async () => {
        const { ethereum } = window;
        try {
          if (!ethereum) return;
          const ethProvider = new ethers.BrowserProvider(
            ethereum as unknown as Eip1193Provider
          );
          await ethProvider.send("eth_requestAccounts", []);
          const signer = await ethProvider.getSigner();
          const accountAddress = await signer.getAddress();

          console.log("Account Address:", accountAddress);

          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
          );
          const tokenInstance = new ethers.Contract(
            YD_TOKEN_ADDRESS,
            YD_TOKEN_ABI,
            signer
          );
          const nftInstance = new ethers.Contract(
            NFT_CONTRACT_ADDRESS,
            NFT_ABI,
            signer
          );

          console.log("Course Contract Address:", contractInstance.target);
          console.log("YD Token Contract Address:", tokenInstance.target);

          // setProvider(ethProvider);
          // setSigner(signer);
          setAccount(accountAddress);
          setContract(contractInstance);
          setYdTokenContract(tokenInstance);
          setNftContract(nftInstance);
          // 检查是否是合约所有者
          const contractOwner = await contractInstance.owner();
          setIsOwner(
            contractOwner.toLowerCase() === accountAddress.toLowerCase()
          );
          console.log("合约所有者:", contractOwner);
          // 获取课程数量
          const count = await contractInstance.courseCount();
          console.log("课程总数:", count.toString());
          setCourseCount(Number(count));
        } catch (error) {
          console.error("初始化失败:", error);
        }
      };
      init();
    }
  }, []);
  const loadCourses = useCallback(async () => {
    if (!courseContract) return;

    try {
      const loadedCourses: Course[] = [];
      for (let i = 1; i <= courseCount; i++) {
        const c = await courseContract.courses(i);
        loadedCourses.push({
          web2CourseId: c.web2CourseId,
          name: c.name,
          price: c.price.toString(),
          isActive: c.isActive,
          creator: c.creator,
        });
      }
      setCourses(loadedCourses);
    } catch (error) {
      console.error("加载课程失败：", error);
    }
  }, [courseContract, courseCount]);

  const loadPurchasedCourses = useCallback(async () => {
    if (!courseContract || !account) return;

    try {
      const loadedPurchasedCourses: Course[] = [];
      for (let i = 1; i <= courseCount; i++) {
        const c = await courseContract.courses(i);
        const hasPurchased = await courseContract.hasCourse(
          account,
          c.web2CourseId
        );
        if (hasPurchased) {
          loadedPurchasedCourses.push({
            web2CourseId: c.web2CourseId,
            name: c.name,
            price: c.price.toString(),
            isActive: c.isActive,
            creator: c.creator,
          });
        }
      }
      setPurchasedCourses(loadedPurchasedCourses);
    } catch (error) {
      console.error("加载已购买课程失败：", error);
    }
  }, [courseContract, account, courseCount]);
  useEffect(() => {
    loadPurchasedCourses();
    loadCourses();
    getAllCourcesFn();
  }, [loadPurchasedCourses, loadCourses]);

  const getAllCourcesFn = async () => {
    const res = await fetch("/api/courses");
    console.log(res, "res");
  };

  const handleAddCourse = async () => {
    if (!courseContract) return;
    if (!newWeb2Id || !newName || !newPrice) {
      setMessage("请填写完整的课程信息");
      return;
    }

    try {
      setMessage("添加课程中，请稍候...");
      const tx = await courseContract.addCourse(
        newWeb2Id,
        newName,
        newPrice
        // ethers.parseUnits(newPrice, 18) // 价格单位
      );
      // 同时给当前用户添加nft
      await tx.wait();
      setShowModal(false);
      setMessage("课程添加成功！");
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "reason" in error &&
        "message" in error
      ) {
        const { reason, message } = error as {
          reason: string;
          message: string;
        };
        setMessage("添加课程失败：" + (reason || message));
      } else {
        setMessage("添加课程失败：未知错误");
      }
    }
  };

  const handleApproveAndPurchaseUnified = async (
    web2CourseId: string
  ): Promise<void> => {
    if (!courseContract || !ydTokenContract || !account || !nftContract) {
      setMessage("合约或账户未初始化，请确保已连接钱包");
      console.error("CourseContract or YDTokenContract is null:", {
        courseContract,
        ydTokenContract,
        account,
        nftContract,
      });
      return;
    }

    try {
      console.log("Course Contract:", courseContract);
      console.log("YD Token Contract:", ydTokenContract);

      // 获取课程信息
      const courseId = await courseContract.web2ToCourseId(web2CourseId);
      console.log("Course ID:", courseId.toString());

      if (courseId.toString() === "0") {
        throw new Error("课程不存在");
      }

      const course = await courseContract.courses(courseId);
      if (!course.isActive) {
        throw new Error("课程未激活");
      }

      const coursePrice = BigInt(course.price);

      // 检查余额
      const balance = await ydTokenContract.balanceOf(account);
      console.log(`用户余额: ${balance.toString()} YD`);

      if (balance < coursePrice) {
        throw new Error(
          `余额不足，需要 ${coursePrice} YD，当前余额 ${balance} YD`
        );
      }

      // 检查授权额度
      const allowance = await ydTokenContract.allowance(
        account,
        courseContract.target
      );
      console.log(`当前授权额度: ${allowance.toString()} YD`);

      if (allowance < coursePrice) {
        setMessage("授权不足，正在授权...");
        const approveTx = await ydTokenContract.approve(
          courseContract.target,
          coursePrice
        );
        await approveTx.wait();
        setMessage("授权成功！");
      }

      // 执行购买
      setMessage("正在购买课程...");
      const tx = await courseContract.purchaseCourse(web2CourseId);
      await tx.wait();
      setMessage(`课程 ${course.name} 购买成功！`);
      // 更新课程
      loadCourses();
      loadPurchasedCourses();
      // 在购买课程后铸造 NFT
      setMessage("正在铸造 NFT...");
      const nftMetadataUri = generateNftMetadata(
        course.name,
        account,
        courseId
      ); // 生成 NFT 的元数据 URI
      console.log(account, courseId, "account-courseId-nftMetadataUri");
      // "https://pub-68eccf4a0d06407daa4a4c00c17dbeff.r2.dev/rp-doge.json"

      const mintTx = await nftContract?.mintFor(
        courseId,
        account,
        nftMetadataUri
      );
      await mintTx.wait();
      setMessage(`NFT 成功铸造，已添加到您的账户！`);
    } catch (err: unknown) {
      console.error("操作失败:", err);

      if (
        typeof err === "object" &&
        err !== null &&
        "reason" in err &&
        "message" in err
      ) {
        const { reason, message } = err as { reason: string; message: string };
        setMessage(reason || message || "操作失败");
      } else {
        setMessage("操作失败：未知错误");
      }
    }
  };

  return (
    <div className="min-h-screen  text-white p-8">
      <div className="container mx-auto">
        <SectionHeader
          title="Course Marketplace"
          content="Course Marketplace is a dynamic online platform designed to connect learners with a diverse array of educational courses offered by expert instructors from around the world. Whether you're seeking to advance your career, acquire new skills, or pursue personal interests, Course Marketplace provides an extensive selection of subjects tailored to meet your unique learning needs."
        />
        {message && (
          <div
            className={`mb-4 p-4 rounded ${
              message.includes("失败") ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-semibold text-gray-800 
          text-white"
          >
            All Courses
          </h2>
          <button
              onClick={() => setShowModal(true)}
              className="
              bg-primary-dark hover:bg-primary-light hover:text-black text-white py-1 px-3 rounded transition-colors  "
            >
              Add Course
          </button>
          {/* {isOwner && (
            <button
              onClick={() => setShowModal(true)}
              className="
              bg-primary-dark hover:bg-primary-light hover:text-black text-white py-1 px-3 rounded transition-colors  "
            >
              Add Course
            </button>
          )} */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <CourseCard
              course={course}
              key={index}
              isPurchased={purchasedCourses.some(
                (p) => p.web2CourseId === course.web2CourseId
              )}
              handleApproveAndPurchaseUnified={handleApproveAndPurchaseUnified}
            />
          ))}
        </div>
        <h2 className="text-2xl font-semibold mb-4">Purchased Course</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {purchasedCourses.length > 0 ? (
            purchasedCourses.map((course, index) => (
              // <li key={index} className="mb-2">
              //   {course.name} (ID: {course.web2CourseId})
              // </li>
              <CourseCard course={course} key={index} isPurchased={true} />
            ))
          ) : (
            <p>ou have not purchased any courses yet.</p>
          )}
        </ul>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="p-8 rounded-xl shadow-xl w-full max-w-md bg-gradient-to-b from-gray-800 to-black border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-primary-light">
              Add New Course
            </h2>
            <div className="mb-6 flex flex-col space-y-4">
              {/* 课程ID 输入框 */}
              <input
                type="text"
                placeholder="Web3 Course ID"
                value={newWeb2Id}
                onChange={(e) => setNewWeb2Id(e.target.value)}
                className="border border-gray-600 p-3 w-full rounded-lg bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              {/* 课程名称 输入框 */}
              <input
                type="text"
                placeholder="Course Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border border-gray-600 p-3 w-full rounded-lg bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              {/* 课程价格 输入框 */}
              <input
                type="text"
                placeholder="Course Price (YD Token Amount)"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="border border-gray-600 p-3 w-full rounded-lg bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-700 text-gray-200 px-5 py-2 rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                className=" text-white hover:text-black px-5 py-2 rounded-lg bg-primary-dark hover:bg-primary-light shadow-lg shadow-green-500/50 transition-all"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      <CourseDialog
        open={showModal}
        handleClose={() => {
          setShowModal(false);
        }}
        handleSubmit={(courseData) => {
          handleAddCourse(courseData);
        }}
      />
    </div>
  );
}
