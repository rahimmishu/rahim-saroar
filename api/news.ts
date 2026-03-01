// api/news.ts

export default function handler(req: any, res: any) {
  // CORS পলিসি সেট করা (যাতে অন্য জায়গা থেকে API কল করলে ব্লক না হয়)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // "Khobor Shunbi?" এর জন্য কিছু ডামি নিউজ ডেটা
  const newsData = [
    {
      title: "🚀 ChatGPT-এর নতুন আপডেট!",
      summary: "OpenAI সম্প্রতি তাদের নতুন AI মডেল রিলিজ করেছে যা কোডিং এবং লজিক্যাল প্রবলেম সলভিংয়ে আরও বেশি পারদর্শী।",
      link: "https://chat.openai.com/"
    },
    {
      title: "💻 React 19 রিলিজ হতে যাচ্ছে",
      summary: "ফ্রন্টএন্ড ডেভেলপারদের জন্য দারুণ খবর! React-এর নতুন ভার্সনে আসছে বেশ কিছু চমকপ্রদ ফিচার ও পারফরম্যান্স ইমপ্রুভমেন্ট।",
      link: "https://react.dev/"
    },
    {
      title: "🤖 J.A.R.V.I.S প্রজেক্টের সফল পরীক্ষা",
      summary: "পার্সোনাল পিসি কন্ট্রোল করার জন্য তৈরি AI অ্যাসিস্ট্যান্ট সফলভাবে ভয়েস কমান্ড রিসিভ করে কাজ করছে।",
      link: "https://rahim-saroar.vercel.app/"
    },
    {
      title: "📱 নতুন প্রযুক্তির স্মার্টফোন বাজারে",
      summary: "আগামী মাসে বাজারে আসতে চলেছে হাই-এন্ড স্পেসিফিকেশন সহ দুর্দান্ত ডিজাইনের নতুন ফ্ল্যাগশিপ স্মার্টফোন।",
      link: "https://rahim-saroar.vercel.app/"
    },
    {
      title: "🎓 EduSpace-এর নতুন স্টাডি ম্যাটেরিয়াল",
      summary: "SSC এবং HSC শিক্ষার্থীদের জন্য বিজ্ঞান বিভাগের নতুন হ্যান্ডনোট ও পিডিএফ যুক্ত করা হয়েছে।",
      link: "https://rahim-saroar.vercel.app/"
    }
  ];

  // সফলভাবে ডেটা পাঠানো
  res.status(200).json(newsData);
}