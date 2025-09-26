"use client";

import { BoxIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import AnimatedCard from "./AnimatedCard";

export default function OverviewCards() {
  const cards = [
    {
      title: "Total Products",
      value: "1,247",
      icon: <BoxIcon className="w-5 h-5" />,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Low Stock Alerts",
      value: "23",
      icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      title: "Total Stock Value",
      value: "$45,230",
      icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <AnimatedCard key={index} delay={index * 150} className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`${card.bgColor} p-3 rounded-full transition-transform duration-500 hover:scale-110`}>
              <div className={card.textColor}>
                {card.icon}
              </div>
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
}