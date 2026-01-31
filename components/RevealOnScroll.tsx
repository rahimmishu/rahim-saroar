import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
}

export const RevealOnScroll = ({ children, width = "100%", delay = 0.25 }: Props) => {
  const ref = useRef(null);
  // once: true মানে এনিমেশনটি একবারই হবে, বারবার হবে না
  const isInView = useInView(ref, { once: true, margin: "-50px" }); 
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 }, // শুরুতে নিচে এবং অদৃশ্য থাকবে
          visible: { opacity: 1, y: 0 }, // পরে উপরে আসবে এবং দৃশ্যমান হবে
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.8, delay: delay, ease: "easeOut" }} // এনিমেশন স্পিড
      >
        {children}
      </motion.div>
    </div>
  );
};

export default RevealOnScroll;