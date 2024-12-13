// components/courses/CourseCard.tsx
import Tag from '../ui/Tag';
import Image from 'next/image';

interface CourseCardProps {
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
  isPurchased?: boolean;  // 新增购买状态属性
  price?: string;         // 新增价格属性
  unit?: string;
  onPurchase: (courseId: string) => void;  // 新增购买处理函数
}

const CourseCard = ({ 
  id,
  title, 
  description, 
  image, 
  difficulty, 
  tags, 
  stats,
  isPurchased = false,
  price = "20",
  unit = "YD",
  onPurchase
}: CourseCardProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100 relative group">
      <div className="relative">
        <Image 
          src={image} 
          alt={title}
          width={400}
          height={225}
          className="w-full object-cover"
        />
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-blue-600">
          {difficulty}
        </span>
      </div>
      
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          {tags.map((tag, index) => (
            <Tag key={index} variant="blue">{tag}</Tag>
          ))}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex gap-4 text-sm text-gray-500">
            <span>{stats.modules} Modules</span>
            <span>{stats.duration}</span>
            <span>{stats.rewards} NFT Rewards</span>
          </div>
          
          {!isPurchased && (
            <button 
              onClick={() => onPurchase(id) }
              className="
                px-4 py-2 rounded-lg font-medium text-sm text-white
                bg-gradient-to-r from-[#2563EB] to-[#7C3AED]
                transition-all duration-200 hover:opacity-90
                absolute bottom-4 right-4
              "
            >
              Buy {price}{unit}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
