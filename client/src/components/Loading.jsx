import React from "react";
import { Ticket } from "lucide-react";

function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-[80vh] space-y-6">
      {/* Spinning gradient ring */}
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-0 flex justify-center items-center">
          <Ticket className="text-primary animate-pulse" size={36} />
        </div>
      </div>

      {/* Text shimmer */}
      <div className="text-lg font-semibold text-gray-600 tracking-wide">
        <span className="animate-pulse text-primary">Booking your experience...</span>
      </div>
    </div>
  );
}

export default Loading;
