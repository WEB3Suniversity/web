'use client';

import React, { useState, useLayoutEffect } from 'react';

interface RippleButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
}

interface RippleStyle {
  left: number;
  top: number;
  width: number;
  height: number;
  backgroundColor: string;
}

interface Ripple extends RippleStyle {
  id: number;
}

const RippleButton = ({
  children,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary'
}: RippleButtonProps) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  
  useLayoutEffect(() => {
    const timeouts = ripples.map((ripple) => {
      return setTimeout(() => {
        setRipples((prevRipples) =>
          prevRipples.filter((prevRipple) => prevRipple.id !== ripple.id)
        );
      }, 600); // Duration of the ripple animation
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [ripples]);

  const addRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const ripple: Ripple = {
      id: ripples.length,
      left: event.clientX - rect.left - radius,
      top: event.clientY - rect.top - radius,
      width: diameter,
      height: diameter,
      backgroundColor: variant === 'primary' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)'
    };

    setRipples((prevRipples) => [...prevRipples, ripple]);
    
    if (onClick) {
      onClick(event);
    }
  };

  const baseStyles = "relative overflow-hidden rounded-lg font-medium transition-all duration-200";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white hover:opacity-90",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border border-gray-200 text-gray-800 hover:bg-gray-50"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={addRipple}
      disabled={disabled}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.left,
            top: ripple.top,
            width: ripple.width,
            height: ripple.height,
            backgroundColor: ripple.backgroundColor
          }}
        />
      ))}
      {children}
    </button>
  );
};

export default RippleButton;