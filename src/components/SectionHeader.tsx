// SectionHeader.jsx
import React from "react";

interface SectionHeaderProps {
  title: string;
  content?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, content }) => (
  <div>
    <h2 className="text-center text-3xl font-bold mb-4 mt-4 text-primary-light border-b-2 border-primary-light pb-2">
      {title}
    </h2>
    <p className="text-center text-gray-500 text-sm mb-4">{content}</p>
  </div>
);

export default SectionHeader;
