// components/ui/Button.tsx
'use client';

import RippleButton from "./RippleButton";

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  onClick 
}: ButtonProps) => {
  const baseStyles = "rounded-lg font-medium transition-all duration-200";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border border-gray-200 text-gray-800 hover:bg-gray-50"
  };
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <RippleButton 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </RippleButton>
  );
};

export default Button;