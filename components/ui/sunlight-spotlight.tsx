import React from "react";

// cn function
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function SunlightSpotlight({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        // ফিক্সড পজিশন এবং সাইজ, যাতে পুরো স্ক্রিন জুড়ে থাকে
        "pointer-events-none fixed inset-0 z-[1] flex w-full h-full overflow-hidden bg-transparent",
        // শুধুমাত্র ডার্ক মোডে দেখাবে, লাইট মোডে অদৃশ্য থাকবে
        "opacity-0 dark:opacity-100 transition-opacity duration-700 ease-in-out",
        className
      )}
    >
      {/* 🔥 অ্যানিমেশন স্টাইল সরাসরি এখানে অ্যাড করা হলো */}
      <style>
        {`
          @keyframes spotlight-move {
            100% {
              opacity: 1;
              transform: translate(-50%, -40%) scale(1);
            }
          }
          .custom-spotlight-anim {
            animation: spotlight-move 2s ease 0.75s 1 forwards;
          }
        `}
      </style>

      {/* আপনার দেওয়া অরিজিনাল SVG কোড */}
      <svg
        className="custom-spotlight-anim pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] -top-40 left-0 md:-top-20 md:left-60 opacity-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 3787 2842"
        fill="none"
      >
        <g filter="url(#filter)">
          <ellipse
            cx="1924.71"
            cy="273.501"
            rx="1924.71"
            ry="273.501"
            transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
            fill="white"
            fillOpacity="0.21"
          />
        </g>
        <defs>
          <filter
            id="filter"
            x="0.860352"
            y="0.838989"
            width="3785.16"
            height="2840.26"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="151"
              result="effect1_foregroundBlur_1065_8"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}