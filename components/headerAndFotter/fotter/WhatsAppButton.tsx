"use client";
import React from "react";
import { Icon } from "@iconify/react";

const WhatsAppButton: React.FC = () => {
  const phoneNumber = "0502699023"; // Replace with the actual phone number
  const message = "Hello, I need assistance!"; // Message to pre-fill
  const encodedMessage = encodeURIComponent(message); // URL encode the message

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank"); // Open the URL in a new tab
  };

  return (
    <button
      onClick={handleClick}
      className="  rounded-full  w-[30px] h-[30px] hover:text-black hover:bg-white/80 flex items-center justify-center   flex-row  p-1"
      aria-label="WhatsApp"
    >
      <div className="animate-pulse w-[24px] h-[24px]">
        <Icon icon="logos:whatsapp-icon" width={24} height={24} />
      </div>
    </button>
  );
};

export default WhatsAppButton;
