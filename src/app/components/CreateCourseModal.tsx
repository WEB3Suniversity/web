// app/components/CreateCourseModal.tsx
import { useState } from 'react';
import { ethers } from 'ethers';
import { hooks } from '@/app/providers/Web3Provider';

const MARKETPLACE_ABI = [
  "function createCourse(string name, uint256 price, string description) external",
];

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCourseModal({ isOpen, onClose, onSuccess }: CreateCourseModalProps) {
  const { useProvider, useAccounts, useIsActive } = hooks;
  const provider = useProvider();
  const accounts = useAccounts();
  const isActive = useIsActive();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !accounts?.[0]) {
      setError('请先连接钱包');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        '0x230d9211950514cC81048716D445931cf44206C7',
        MARKETPLACE_ABI,
        signer
      );

      // 将价格转换为wei
      const priceInWei = ethers.utils.parseEther(formData.price);

      const tx = await contract.createCourse(
        formData.name,
        priceInWei,
        formData.description
      );

      await tx.wait();
      
      onSuccess();
      onClose();
      setFormData({ name: '', price: '', description: '' });
    } catch (err: any) {
      console.error('创建课程失败:', err);
      setError(err.message || '创建课程失败');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">创建新课程</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                课程名称
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="输入课程名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                课程价格 (STK)
              </label>
              <input
                type="number"
                step="0.000000000000000001"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="输入课程价格"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                课程描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                rows={4}
                placeholder="输入课程描述"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              {loading ? '创建中...' : '创建课程'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}