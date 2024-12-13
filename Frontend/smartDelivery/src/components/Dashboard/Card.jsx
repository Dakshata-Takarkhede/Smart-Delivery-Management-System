import React from "react";

const Card = ({ title, value, icon, color }) => {

  const backgroundColor = {
    blue: "#1E40AF", // Tailwind blue-800
    green: "#10B981", // Tailwind green-500
    orange: "#F97316", // Tailwind orange-600
    purple: "#7C3AED", // Tailwind purple-600
  };
  
  return (
    <div
      className="p-6 rounded-lg shadow-lg text-white flex items-center justify-between"
      style={{ backgroundColor: backgroundColor[color] || "#6B7280" }} // Default gray if color is not found
    >
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-4xl font-bold mt-2">{value}</p>
      </div>
      <div className="text-5xl opacity-80">{icon}</div>
    </div>
  );
};

export default Card;
