"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI } from "@/utils/CONTRACT_ABI";
import MetaMaskCard from "@/components/connectorCards/MetaMaskCard";

// 请替换为您的YD代币地址和ABI
const YD_TOKEN_ADDRESS = "0x46A653Db56B81c87b30A4A0F46b8D3546E5D832b";
import { YD_TOKEN_ABI } from "@/utils/YiDengToKen_ABI";

const CONTRACT_ADDRESS = "0x49D881c042d8F2663a540cd904b205d46Fe0bdFb";

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
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [ydTokenContract, setYdTokenContract] =
    useState<ethers.Contract | null>(null);

  const [account, setAccount] = useState<string | null>(null);
  const [courseCount, setCourseCount] = useState<number>(0);
  const [courses, setCourses] = useState<Course[]>([]);

  const [purchaseId, setPurchaseId] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [newWeb2Id, setNewWeb2Id] = useState("");
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [isOwner, setIsOwner] = useState(false);

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
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        const s = await provider.getSigner();
        setSigner(s);
        const address = await s.getAddress();
        setAccount(address);

        const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, s);
        setContract(c);

        // 初始化YD代币合约实例
        const ydToken = new ethers.Contract(YD_TOKEN_ADDRESS, YD_TOKEN_ABI, s);
        setYdTokenContract(ydToken);

        try {
          const count = await c.courseCount();
          setCourseCount(Number(count));

          const ownerAddress = await c.owner();
          setIsOwner(ownerAddress.toLowerCase() === address.toLowerCase());
        } catch (error) {
          console.error("读取合约数据失败：", error);
        }
      }
    };
    init();
  }, [provider]);

  useEffect(() => {
    const loadCourses = async () => {
      if (contract && courseCount > 0) {
        const loadedCourses: Course[] = [];
        for (let i = 1; i <= courseCount; i++) {
          const c = await contract.courses(i);
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
  }, [contract, courseCount]);

  const handlePurchase = async () => {
    if (!contract || !ydTokenContract || !purchaseId) {
      setMessage("请确保已连接钱包并输入要购买的课程web2CourseId");
      return;
    }
    // 根据purchaseId获取对应课程价格
    const targetCourse = courses.find(
      (course) => course.web2CourseId === purchaseId
    );
    if (!targetCourse) {
      setMessage("未找到对应课程");
      return;
    }

    const coursePrice = targetCourse.price; // 字符串
    setMessage("正在授权YD代币支出，请稍候...");

    try {
      // 授权CourseMarket合约可从用户账户中转出课价对应的YD代币数额
      await ydTokenContract.approve(
        CONTRACT_ADDRESS,
        ethers.parseUnits(coursePrice, 18) // 假设YD是18位小数
      );
      setMessage("授权成功，即将购买课程...");
    } catch (error: any) {
      setMessage("授权失败：" + (error.reason || error.message));
      return;
    }

    try {
      setMessage("购买中，请稍候...");
      const tx = await contract.purchaseCourse(purchaseId);
      await tx.wait();
      setMessage("购买成功！");
    } catch (error: any) {
      setMessage("购买失败：" + (error.reason || error.message));
    }
  };

  const handleAddCourse = async () => {
    if (!contract) return;
    if (!newWeb2Id || !newName || !newPrice) {
      setMessage("请填写完整的课程信息");
      return;
    }
    setMessage("添加课程中...");
    try {
      const tx = await contract.addCourse(
        newWeb2Id,
        newName,
        ethers.parseUnits(newPrice, 0)
      );
      await tx.wait();
      setMessage("课程添加成功！");
    } catch (error: any) {
      setMessage("添加课程失败：" + (error.reason || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <MetaMaskCard />

      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">课程市场</h1>
        {account ? (
          <p className="mb-4">当前账户：{account}</p>
        ) : (
          <p className="mb-4">请连接您的钱包</p>
        )}

        {message && (
          <div className="mb-4 p-4 bg-gray-800 rounded">{message}</div>
        )}

        <h2 className="text-2xl font-semibold mb-4">所有课程列表</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full table-auto border border-gray-700 rounded-lg bg-gray-800 text-white">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 border-b border-gray-700">#</th>
                <th className="text-left p-4 border-b border-gray-700">
                  Web2 Course ID
                </th>
                <th className="text-left p-4 border-b border-gray-700">Name</th>
                <th className="text-left p-4 border-b border-gray-700">
                  Price (YD)
                </th>
                <th className="text-left p-4 border-b border-gray-700">
                  Status
                </th>
                <th className="text-left p-4 border-b border-gray-700">
                  Creator
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={course.web2CourseId}
                  className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-850"}
                >
                  <td className="p-4 border-b border-gray-700">{index + 1}</td>
                  <td className="p-4 border-b border-gray-700">
                    {course.web2CourseId}
                  </td>
                  <td className="p-4 border-b border-gray-700">
                    {course.name}
                  </td>
                  <td className="p-4 border-b border-gray-700">
                    {course.price}
                  </td>
                  <td className="p-4 border-b border-gray-700">
                    {course.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="p-4 border-b border-gray-700">
                    {course.creator}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-semibold mb-4">购买课程</h2>
        <div className="mb-8">
          <input
            type="text"
            placeholder="输入Web2课程ID"
            value={purchaseId}
            onChange={(e) => setPurchaseId(e.target.value)}
            className="px-4 py-2 rounded mr-2 text-black"
          />
          <button
            onClick={handlePurchase}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            购买
          </button>
        </div>

        {isOwner && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              添加新课程（仅Owner）
            </h2>
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
    </div>
  );
}
