import { motion } from "motion/react";
import * as React from "react";

// যদি আপনার utils ফাইল না থাকে তবে এই cn ফাংশনটি ব্যবহার করুন, 
// আর থাকলে import { cn } from "@/lib/utils"; আনকমেন্ট করুন
// import { cn } from "@/lib/utils";
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  colors?: string[];
  duration?: number;
  borderWidth?: number;
  animated?: boolean;
}

const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  (
    {
      children,
      // ডিফল্ট কালার প্যালেট (Bright Rainbow)
      colors = [
        "#ff0000",
        "#ffa500",
        "#ffff00",
        "#008000",
        "#0000ff",
        "#4b0082",
        "#ee82ee",
        "#ff0000", // লুপ স্মুথ করার জন্য লাস্ট কালার রিপিট
      ],
      duration = 4, // স্পিড কন্ট্রোল (সেকেন্ড)
      borderWidth = 2, // বর্ডারের পুরুত্ব
      animated = true,
      className,
      onClick,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    
    // Conic Gradient তৈরি করা হচ্ছে
    const gradientColors = colors.join(", ");

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        // প্যাডিং দিয়েই মূলত বর্ডার তৈরি করা হচ্ছে
        style={{ padding: borderWidth }}
        {...props}
      >
        {/* 🔥 1. Animated Gradient Background (Rotating Layer) */}
        <motion.div
          className="absolute inset-[-200%]" // বাটন থেকে বড় করা হয়েছে যাতে ঘোরার সময় কোণা খালি না থাকে
          style={{
            background: `conic-gradient(from 0deg, ${gradientColors})`,
          }}
          animate={
            animated
              ? { rotate: 360 }
              : undefined
          }
          transition={
            animated
              ? {
                  duration,
                  repeat: Infinity,
                  ease: "linear",
                }
              : undefined
          }
        />

        {/* 🔥 2. Solid Content Layer (Masking the Center) */}
        {/* bg-slate-950 বা bg-white দিয়ে মাঝখানটা ঢাকা হয়েছে, ফলে শুধু বর্ডার দেখা যাবে */}
        <span
          className="relative z-10 flex h-full w-full items-center justify-center gap-2 rounded-[9px] bg-white px-6 py-2 text-slate-950 dark:bg-slate-950 dark:text-white"
        >
          {children}
        </span>
      </button>
    );
  },
);

RainbowButton.displayName = "RainbowButton";

export { RainbowButton };