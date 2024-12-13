'use client';

interface TagProps {
  children: React.ReactNode;
  variant?: "blue" | "purple" | "gray";
  className?: string;
}

const Tag = ({
  children,
  variant = "blue",
  className = "",
}: TagProps) => {
  const variants = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Tag;