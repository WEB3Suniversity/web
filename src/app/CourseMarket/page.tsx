"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI } from "@/utils/CONTRACT_ABI";
import MetaMaskCard from "@/components/connectorCards/MetaMaskCard";
// import { BigInt } from "ethers"; // 正确导入 BigNumber
// 请替换为您的YD代币地址和ABI
const YD_TOKEN_ADDRESS = "0x4Ee7e7E6104451c65ecFe94B6878e1025B02ccA8";
import { YD_TOKEN_ABI } from "@/utils/YiDengToKen_ABI";

const CONTRACT_ADDRESS = "0xC926e252e31Ea9450230decd200F6538133DA0a0";

interface Course {
  web2CourseId: string;
  name: string;
  price: string;
  isActive: boolean;
  creator: string;
}

export default function CourseMarketPage() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [courseContract, setContract] = useState<ethers.Contract | null>(null);
  const [ydTokenContract, setYdTokenContract] =
    useState<ethers.Contract | null>(null);

  const [account, setAccount] = useState<string | null>(null);
  const [courseCount, setCourseCount] = useState<number>(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);

  const [newWeb2Id, setNewWeb2Id] = useState("");
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const [purchaseId, setPurchaseId] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);
    } else {
      console.error("请安装MetaMask");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
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

        console.log("Course Contract Address:", contractInstance.target);
        console.log("YD Token Contract Address:", tokenInstance.target);

        setProvider(ethProvider);
        setSigner(signer);
        setAccount(accountAddress);
        setContract(contractInstance);
        setYdTokenContract(tokenInstance);
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
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      if (courseContract && courseCount > 0 && courses.length === 0) {
        // 避免重复加载
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
      }
    };
    loadCourses();
  }, [courseContract, courseCount]); // 保持依赖项不变

  useEffect(() => {
    const loadPurchasedCourses = async () => {
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
    };

    loadPurchasedCourses();
  }, [courseContract, account, courseCount]);

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
      await tx.wait();
      setMessage("课程添加成功！");
    } catch (error: any) {
      setMessage("添加课程失败：" + (error.reason || error.message));
    }
  };
  const handleApprove = async () => {
    if (!ydTokenContract) {
      setMessage("YD代币合约未初始化");
      return;
    }

    try {
      const approveAmount = ethers.parseUnits("10", 18); // 授权 1000 YD
      setMessage("正在授权 YD 代币支出，请稍候...");
      const tx = await ydTokenContract.approve(CONTRACT_ADDRESS, approveAmount);
      await tx.wait();
      setMessage("授权成功！您现在可以购买课程了。");
    } catch (error: any) {
      setMessage("授权失败：" + (error.reason || error.message));
    }
  };

  const handleApproveAndPurchaseUnified = async (
    web2CourseId: string
  ): Promise<void> => {
    if (!courseContract || !ydTokenContract || !account) {
      setMessage("合约或账户未初始化，请确保已连接钱包");
      console.error("CourseContract or YDTokenContract is null:", {
        courseContract,
        ydTokenContract,
        account,
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
    } catch (err: any) {
      console.error("操作失败:", err);
      setMessage(err.reason || err.message || "操作失败");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <MetaMaskCard />
      <button
        onClick={handleApprove}
        className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-500"
      >
        授权 YD 代币
      </button>

      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">课程市场</h1>
        {account && <p>当前账户：{account}</p>}

        {message && (
          <div
            className={`mb-4 p-4 rounded ${
              message.includes("失败") ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4">所有课程列表</h2>
        <table className="w-full table-auto border bg-gray-800 text-white mb-8">
          <thead className="bg-gray-700">
            <tr>
              <th>#</th>
              <th>Web2 Course ID</th>
              <th>Name</th>
              <th>Price (YD)</th>
              <th>Is Active</th>
              <th>Creator</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course.web2CourseId}>
                <td>{index + 1}</td>
                <td>{course.web2CourseId}</td>
                <td>{course.name}</td>
                <td>{course.price}</td>
                <td>{course.isActive ? "Yes" : "No"}</td>
                <td>{course.creator}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-2xl font-semibold mb-4">已购买课程</h2>
        <ul className="list-disc pl-8">
          {purchasedCourses.length > 0 ? (
            purchasedCourses.map((course, index) => (
              <li key={index} className="mb-2">
                {course.name} (ID: {course.web2CourseId})
              </li>
            ))
          ) : (
            <p>您还没有购买任何课程。</p>
          )}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">购买课程</h2>
        <input
          placeholder="输入Web2课程ID"
          value={purchaseId}
          onChange={(e) => setPurchaseId(e.target.value)}
          className="px-4 py-2 text-black rounded mr-2"
        />
        <button
          onClick={() => handleApproveAndPurchaseUnified(purchaseId)} // ✅ 传入正确参数
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          购买
        </button>
      </div>
      {isOwner && (
        <>
          <h2 className="text-2xl font-semibold mb-4">添加新课程（仅Owner）</h2>
          <div className="mb-4 flex flex-col space-y-2 max-w-sm">
            <input
              type="text"
              placeholder="Web2课程ID"
              value={newWeb2Id}
              onChange={(e) => setNewWeb2Id(e.target.value)}
              className="px-4 py-2 rounded text-black"
            />
            <input
              type="text"
              placeholder="课程名称"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-4 py-2 rounded text-black"
            />
            <input
              type="text"
              placeholder="课程价格（YD代币数量）"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="px-4 py-2 rounded text-black"
            />
            <button
              onClick={handleAddCourse}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            >
              添加课程
            </button>
          </div>
        </>
      )}
    </div>
  );
}
