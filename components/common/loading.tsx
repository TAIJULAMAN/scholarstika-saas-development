import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[100px]">
      <div className="w-10 h-10 animate-spin rounded-full border-dashed border-8 border-green-500"></div>
    </div>
  );
}
