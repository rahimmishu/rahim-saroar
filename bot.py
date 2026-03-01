import requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# ⚠️ সতর্কতা: প্রোডাকশনে যাওয়ার আগে টোকেনটি .env ফাইলে লুকিয়ে রাখবে

WEB_APP_URL = 'https://rahim-saroar.vercel.app/'

# ওয়েব অ্যাপ ওপেন করার বাটন তৈরির ফাংশন
def get_webapp_keyboard():
    keyboard = [[InlineKeyboardButton("🚀 Open Portfolio", web_app=WebAppInfo(url=WEB_APP_URL))]]
    return InlineKeyboardMarkup(keyboard)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "হ্যালো! 👋 আমার পার্সোনাল পোর্টফোলিও বটে আপনাকে স্বাগতম!\n\n"
        "আমি রহিম সারোয়ার মিশু, একজন Full Stack Developer এবং AI Enthusiast. "
        "নিচের বাটন থেকে সরাসরি আমার ওয়েবসাইটটি এক্সপ্লোর করতে পারেন।"
    )
    await update.message.reply_text(text, reply_markup=get_webapp_keyboard())

async def about(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "👨‍💻 *আমার সম্পর্কে:*\n\n"
        "আমি বর্তমানে একাদশ শ্রেণিতে বিজ্ঞান বিভাগে পড়ছি। "
        "কোডিং, প্রবলেম সলভিং আর নতুন প্রযুক্তি (বিশেষ করে Python, React, Next.js) নিয়ে কাজ করাই আমার প্যাশন। "
        "পাশাপাশি আমি কনটেন্ট ক্রিয়েশন এবং পাবলিক স্পিকিং নিয়েও কাজ করছি।"
    )
    await update.message.reply_text(text, parse_mode='Markdown', reply_markup=get_webapp_keyboard())

async def projects(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "💻 *আমার উল্লেখযোগ্য প্রজেক্টসমূহ:*\n\n"
        "১. *EduSpace:* SSC/HSC শিক্ষার্থীদের জন্য একটি এডুকেশনাল প্ল্যাটফর্ম।\n"
        "২. *Khobor Shunbi?:* একটি চমৎকার AI নিউজ এগ্রিগেটর।\n"
        "৩. *Stealth GPS Tracker:* পাইথন দিয়ে তৈরি একটি জিপিএস ট্র্যাকিং সিস্টেম।\n\n"
        "বিস্তারিত দেখতে নিচের অ্যাপটি ওপেন করুন!"
    )
    await update.message.reply_text(text, parse_mode='Markdown', reply_markup=get_webapp_keyboard())

async def ai_works(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "🤖 *AI প্রজেক্ট ও কাজ:*\n\n"
        "আমি বর্তমানে *J.A.R.V.I.S* নামের একটি পার্সোনাল AI অ্যাসিস্ট্যান্ট বানাচ্ছি, যা পিসি কন্ট্রোল করতে পারে! "
        "এছাড়া আমি AI দিয়ে সিনেম্যাটিক এবং হাইপার-রিয়েলিস্টিক ইমেজ জেনারেট করতে খুব পছন্দ করি।"
    )
    await update.message.reply_text(text, parse_mode='Markdown', reply_markup=get_webapp_keyboard())

async def contact(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "📧 *যোগাযোগ:*\n\n"
        "আমার সাথে কানেক্ট হতে বা যেকোনো প্রজেক্ট নিয়ে আলোচনা করতে আমার পোর্টফোলিও অ্যাপের 'Contact' সেকশনে যেতে পারেন, "
        "অথবা আমার 'Rhythm of Peace' ফেসবুক পেজেও মেসেজ দিতে পারেন!"
    )
    await update.message.reply_text(text, parse_mode='Markdown', reply_markup=get_webapp_keyboard())

# 🆕 নতুন যুক্ত করা 'khobor' ফাংশন
async def khobor(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # ইউজারকে জানানো হচ্ছে যে খবর খোঁজা হচ্ছে
    processing_msg = await update.message.reply_text("⏳ 'Khobor Shunbi?' থেকে আজকের বাছাই করা খবরগুলো সংগ্রহ করছি, একটু অপেক্ষা করুন...")
    
    try:
        # তোমার ওয়েবসাইটের API Endpoint
        api_url = f'{WEB_APP_URL}api/news' 
        
        response = requests.get(api_url)
        
        if response.status_code == 200:
            news_data = response.json()
            
            final_message = "📰 *Khobor Shunbi? - আজকের শীর্ষ সংবাদ*\n\n"
            
            # API থেকে আসা ডেটাগুলো লুপ করে সাজানো হচ্ছে (প্রথম ৫টি)
            for index, news in enumerate(news_data[:5]): 
                title = news.get('title', 'শিরোনাম পাওয়া যায়নি')
                summary = news.get('summary', 'বিস্তারিত জানতে লিংকে ক্লিক করুন')
                link = news.get('link', WEB_APP_URL)
                
                final_message += f"*{index + 1}. {title}*\n"
                final_message += f"📝 {summary}\n"
                final_message += f"🔗 [বিস্তারিত পড়ুন]({link})\n\n"
            
            await processing_msg.delete()
            await update.message.reply_text(final_message, parse_mode='Markdown', disable_web_page_preview=True, reply_markup=get_webapp_keyboard())
            
        else:
            await processing_msg.edit_text("❌ এই মুহূর্তে খবরগুলো লোড করা যাচ্ছে না। API ঠিকমতো কাজ করছে কিনা চেক করুন।", reply_markup=get_webapp_keyboard())
            
    except Exception as e:
        await processing_msg.edit_text("❌ সার্ভারে কোনো সমস্যা হয়েছে অথবা Vercel-এ API এখনো তৈরি করা হয়নি।", reply_markup=get_webapp_keyboard())


if __name__ == '__main__':
    # বট রান করার মূল অংশ
    app = ApplicationBuilder().token(TOKEN).build()

    # কমান্ডগুলোর সাথে ফাংশন যুক্ত করা হলো
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("about", about))
    app.add_handler(CommandHandler("projects", projects))
    app.add_handler(CommandHandler("ai_works", ai_works))
    app.add_handler(CommandHandler("contact", contact))
    
    # 🆕 নতুন কমান্ড হ্যান্ডলার
    app.add_handler(CommandHandler("khobor", khobor))

    print("বট সফলভাবে চালু হয়েছে! টেলিগ্রামে গিয়ে চেক করুন...")
    app.run_polling()