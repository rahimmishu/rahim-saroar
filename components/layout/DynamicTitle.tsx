import { useEffect } from 'react';

const DynamicTitle = () => {
  useEffect(() => {
    const originalTitle = document.title;
    let timeout: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // ইউজার যখন অন্য ট্যাবে যাবে
        document.title = "😭 Come back to Mishu's World!";
        
        // অথবা এনিমেশন টাইটেল (Optional)
        // const titles = ["😭 Miss you!", "🥺 Don't go...", "💻 Coding here..."];
        // let i = 0;
        // timeout = setInterval(() => {
        //   document.title = titles[i++ % titles.length];
        // }, 1000);

      } else {
        // ইউজার যখন আবার ফিরে আসবে
        document.title = originalTitle;
        clearInterval(timeout);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(timeout);
      document.title = originalTitle;
    };
  }, []);

  return null; // এটি কোনো UI রেন্ডার করবে না, শুধু ফাংশনালিটি
};

export default DynamicTitle;