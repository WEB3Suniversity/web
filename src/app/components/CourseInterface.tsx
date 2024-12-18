import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { hooks } from '@/app/providers/Web3Provider';
import CreateCourseModal from './CreateCourseModal';

// 课程市场合约 ABI
const MARKETPLACE_ABI = [
  "function getCourse(uint256 _courseId) view returns (string name, uint256 price, bool isActive, string description, address instructor)",
  "function hasPurchasedCourse(address _student, uint256 _courseId) view returns (bool)",
  "function purchaseCourse(uint256 _courseId)",
  "function courseCount() view returns (uint256)",
  "function courses(uint256) view returns (string name, uint256 price, bool isActive, string description, address instructor)"
];

// Token ABI (用于授权)
const TOKEN_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

// 合约地址
const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '';
// 代币合约地址
const NEXT_PUBLIC_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

export default function CourseInterface() {
  const { useProvider, useAccounts, useIsActive } = hooks;
  const provider = useProvider();
  const accounts = useAccounts();
  const isActive = useIsActive();
  const account = accounts?.[0];

  // 状态管理
  const [marketplaceContract, setMarketplaceContract] = useState<ethers.Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // 添加模态框状态
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 初始化合约
  useEffect(() => {
    if (provider && MARKETPLACE_ADDRESS && NEXT_PUBLIC_TOKEN_ADDRESS) {
      const marketplace = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider);
      const token = new ethers.Contract(NEXT_PUBLIC_TOKEN_ADDRESS, TOKEN_ABI, provider);
      setMarketplaceContract(marketplace);
      setTokenContract(token);
    }
  }, [provider]);
  // 添加新的useEffect来处理课程加载
  useEffect(() => {
    if (marketplaceContract && isActive) {
      fetchCourses();
    }
  }, [marketplaceContract, isActive, account]);

  // 获取所有课程
  const fetchCourses = async () => {
    if (!marketplaceContract) return;

    try {
      setLoading(true);
      setError('');
      
      console.log("开始获取课程...");
      const courseCount = await marketplaceContract.courseCount();
      console.log("课程总数:", courseCount.toString());
      
      const coursesData = [];

      for (let i = 1; i <= courseCount.toNumber(); i++) {
        console.log(`获取第 ${i} 个课程...`);
        const course = await marketplaceContract.getCourse(i);
        const purchased = account ? await marketplaceContract.hasPurchasedCourse(account, i) : false;
        
        console.log("课程信息:", {
          id: i,
          name: course.name,
          price: ethers.utils.formatEther(course.price),
          isActive: course.isActive,
          description: course.description,
          instructor: course.instructor
        });
        
        coursesData.push({
          id: i,
          name: course.name,
          price: ethers.utils.formatEther(course.price),
          isActive: course.isActive,
          description: course.description,
          instructor: course.instructor,
          purchased
        });
      }

      console.log("获取到的所有课程:", coursesData);
      setCourses(coursesData);
    } catch (err) {
      console.error('获取课程失败:', err);
      setError('获取课程信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 购买课程
  const handlePurchase = async (courseId: number, price: string) => {
    if (!marketplaceContract || !tokenContract || !account || !provider) {
      setError('请先连接钱包');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // 获取签名者
      const signer = provider.getSigner();
      const marketplaceWithSigner = marketplaceContract.connect(signer);
      const tokenWithSigner = tokenContract.connect(signer);

      // 检查授权
      const priceWei = ethers.utils.parseEther(price);
      const allowance = await tokenContract.allowance(account, MARKETPLACE_ADDRESS);

      if (allowance.lt(priceWei)) {
        // 需要授权
        const approveTx = await tokenWithSigner.approve(MARKETPLACE_ADDRESS, priceWei);
        setSuccess('等待授权确认...');
        await approveTx.wait();
      }

      // 购买课程
      const purchaseTx = await marketplaceWithSigner.purchaseCourse(courseId);
      setSuccess('等待购买确认...');
      await purchaseTx.wait();
      
      setSuccess('购买成功！');
      // 刷新课程状态
      fetchCourses();
    } catch (err: any) {
      console.error('购买失败:', err);
      setError(err.message || '购买失败');
    } finally {
      setLoading(false);
    }
  };

  if (!isActive) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-yellow-700 font-medium">请连接钱包以访问课程平台</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">课程列表</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">课程总数: {courses.length}</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              创建课程
            </button>
          </div>
        </div>

        {/* 状态提示 */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">加载中...</span>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* 课程网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform duration-200 hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
                  {course.isActive ? (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      可购买
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      已下架
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                    <span className="text-gray-500">STK</span>
                  </div>
                  {course.purchased && (
                    <span className="text-sm text-blue-600 font-medium">✓ 已购买</span>
                  )}
                </div>

                {course.purchased ? (
                  <button
                    className="w-full py-3 px-4 rounded-lg bg-gray-100 text-gray-600 font-medium cursor-not-allowed"
                    disabled
                  >
                    已拥有
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(course.id, course.price)}
                    disabled={loading || !course.isActive}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 
                      ${loading || !course.isActive
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                  >
                    {loading ? '处理中...' : '购买课程'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && !loading && (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">暂无课程</h3>
            <p className="mt-1 text-sm text-gray-500">课程正在准备中，敬请期待...</p>
          </div>
        )}

        <CreateCourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchCourses();
          }}
        />
      </div>
    </div>
  );
}