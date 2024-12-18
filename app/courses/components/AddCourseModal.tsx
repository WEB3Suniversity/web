import React, { useState } from "react";
import { Dialog, TextField, MenuItem } from "@mui/material";
import { useAccount } from "wagmi";
import { getChainId, readContract, writeContract } from "@wagmi/core";
import toast from "react-hot-toast";
import { config } from "@/config/wagmi";
import * as abiJson from "@/abi/CourseMarket.json";

const CourseDialog = () => {
  const { abi, networks } = abiJson;
  const { address: accountArress, isConnected } = useAccount();
  const chainId = getChainId(config);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    level: "beginner",
    category: "Smart Contracts",
    modules: "",
    hours: "",
    rewards: "",
    price: "", // 新添加的价格字段
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. 创建数据库记录
      console.log("🚀 ~ handleSubmit ~ courseData:", courseData);
      const dbResponse = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createCourse",
          payload: { ...courseData },
        }),
      });

      if (!dbResponse.ok) {
        throw new Error("Failed to create course in database");
      }

      // console.log("🚀 ~ dbResponse ~ :", await dbResponse.json())

      const res = await dbResponse.json();
      const {
        data: { courseId },
      } = res;
      console.log("🚀 ~ handleSubmit ~ res:", res);
      console.log("🚀 ~ handleSubmit ~ courseId:", courseId);

      const address = networks[chainId].address;

      const tx = await writeContract(config, {
        address,
        abi,
        functionName: "addCourse",
        args: [courseId, courseData.title, courseData.price],
      });
      
      console.log("🚀 ~ handleSubmit ~ tx:", tx);

      if (tx) {
        // 4. 更新数据库状态
        await fetch(`/api/courses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateCourse",
            courseId,
            status: "active",
          }),
        });
      }

      // console.log('toast', toast);
      toast("课程创建成功！");
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "创建课程失败");

      // 如果有 courseId，更新状态为失败
      // if (courseId) {
      //   await fetch(`/api/courses`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       action: "updateCourseStatus",
      //       status: "failed",
      //     }),
      //   });
      // }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 mb-6 flex justify-end px-4">
      <button
        onClick={handleOpen}
        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
      >
        添加课程
      </button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">添加新课程</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="课程标题"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="课程描述"
              name="description"
              value={courseData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />

            <TextField
              fullWidth
              select
              label="难度等级"
              name="level"
              value={courseData.level}
              onChange={handleChange}
              required
            >
              <MenuItem value="beginner">入门</MenuItem>
              <MenuItem value="intermediate">中级</MenuItem>
              <MenuItem value="advanced">高级</MenuItem>
            </TextField>

            <TextField
              fullWidth
              select
              label="课程分类"
              name="category"
              value={courseData.category}
              onChange={handleChange}
              required
            >
              <MenuItem value="Smart Contracts">智能合约</MenuItem>
              <MenuItem value="DeFi">DeFi</MenuItem>
              <MenuItem value="NFT">NFT</MenuItem>
              <MenuItem value="GameFi">GameFi</MenuItem>
            </TextField>

            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="模块数量"
                name="modules"
                type="number"
                value={courseData.modules}
                onChange={handleChange}
                required
              />
              <TextField
                label="课程时长(小时)"
                name="hours"
                type="number"
                value={courseData.hours}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="奖励代币数量"
                name="rewards"
                type="number"
                value={courseData.rewards}
                onChange={handleChange}
                required
              />
              <TextField
                label="价格(YD)"
                name="price"
                type="number"
                value={courseData.price}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: <span className="text-gray-500 mr-2">YD</span>,
                }}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-md text-sm font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                创建课程
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default CourseDialog;
