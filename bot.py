import os
import requests
import threading
import yt_dlp
from flask import Flask
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# Load environment variables
load_dotenv('.env.local')
TOKEN = os.getenv('TOKEN')
WEB_APP_URL = 'https://rahim-saroar.vercel.app/'

# --- Dummy Web Server using Flask (Render Free Tier Hack) ---
web_app = Flask(__name__)

@web_app.route('/')
def home():
    return "🤖 Bot is successfully running on Render!"

def run_dummy_server():
    port = int(os.environ.get('PORT', 10000))
    # debug=False এবং use_reloader=False দেওয়া জরুরি, নাহলে থ্রেডিংয়ে সমস্যা হবে
    web_app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)
# -------------------------------------------------------------

# Web App Button Function
def get_webapp_keyboard():
    keyboard = [[InlineKeyboardButton("🚀 Open Portfolio App", web_app=WebAppInfo(url=WEB_APP_URL))]]
    return InlineKeyboardMarkup(keyboard)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "👋 <b>স্বাগতম আমার ডিজিটাল ওয়ার্ল্ডে!</b>\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "আমি <b>রহিম সারোয়ার মিশু</b>, একজন Full Stack Developer এবং AI Enthusiast।\n\n"
        "আমার তৈরি করা প্রজেক্ট, AI টুলস এবং পোর্টফোলিও দেখতে নিচের বাটনটিতে ক্লিক করে সরাসরি অ্যাপটি এক্সপ্লোর করতে পারেন।"
    )
    await update.message.reply_text(text, parse_mode='HTML', reply_markup=get_webapp_keyboard())

async def about(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "👨‍💻 <b>আমার সম্পর্কে (About Me)</b>\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "আমি বর্তমানে একাদশ শ্রেণিতে বিজ্ঞান বিভাগে অধ্যয়নরত।\n\n"
        "💡 <b>প্যাশন ও স্কিলস:</b>\n"
        "• কোডিং ও প্রবলেম সলভিং (Python, React, Next.js)\n"
        "• কনটেন্ট ক্রিয়েশন ও পাবলিক স্পিকিং\n"
        "• AI ইন্টিগ্রেশন ও ডেভেলপমেন্ট"
    )
    await update.message.reply_text(text, parse_mode='HTML', reply_markup=get_webapp_keyboard())

async def projects(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "💻 <b>উল্লেখযোগ্য প্রজেক্টসমূহ</b>\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "🎓 <b>EduSpace:</b>\n"
        "<i>SSC/HSC শিক্ষার্থীদের জন্য একটি আধুনিক এডুকেশনাল প্ল্যাটফর্ম।</i>\n\n"
        "📰 <b>Khobor Shunbi?:</b>\n"
        "<i>একাধিক সোর্স থেকে ডেটা সংগ্রহকারী একটি চমৎকার AI নিউজ এগ্রিগেটর।</i>\n\n"
        "📍 <b>Stealth GPS Tracker:</b>\n"
        "<i>পাইথন দিয়ে তৈরি একটি অ্যাডভান্সড জিপিএস ট্র্যাকিং সিস্টেম।</i>\n\n"
        "📌 <i>আরও প্রজেক্ট দেখতে নিচের অ্যাপটি ওপেন করুন!</i>"
    )
    await update.message.reply_text(text, parse_mode='HTML', reply_markup=get_webapp_keyboard())

async def ai_works(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "🤖 <b>AI প্রজেক্ট ও ক্রিয়েশনস</b>\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "আমি বর্তমানে <b>J.A.R.V.I.S</b> নামের একটি পার্সোনাল AI অ্যাসিস্ট্যান্ট ডেভেলপ করছি, যা ভয়েস কমান্ডের মাধ্যমে পুরো পিসি কন্ট্রোল করতে সক্ষম!\n\n"
        "এছাড়াও আমি AI টুলস ব্যবহার করে সিনেম্যাটিক এবং হাইপার-রিয়েলিস্টিক ইমেজ জেনারেট করতে ভীষণ পছন্দ করি।"
    )
    await update.message.reply_text(text, parse_mode='HTML', reply_markup=get_webapp_keyboard())

async def contact(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "📧 <b>যোগাযোগ (Contact)</b>\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "যেকোনো প্রজেক্ট, আইডিয়া বা কোলাবোরেশন নিয়ে আলোচনা করতে চাইলে:\n\n"
        "🌐 আমার পোর্টফোলিও অ্যাপের <b>Contact</b> সেকশন ব্যবহার করুন।\n"
        "📱 অথবা আমার <b>Rhythm of Peace</b> ফেসবুক পেজে মেসেজ দিতে পারেন।"
    )
    await update.message.reply_text(text, parse_mode='HTML', reply_markup=get_webapp_keyboard())

async def khobor(update: Update, context: ContextTypes.DEFAULT_TYPE):
    processing_msg = await update.message.reply_text("⏳ <i>Fetching today's top news from 'Khobor Shunbi?'...</i>", parse_mode='HTML')
    
    try:
        api_url = 'https://khobor-shunbi.vercel.app/live_news.json' 
        response = requests.get(api_url)
        
        if response.status_code == 200:
            news_data = response.json()
            
            final_message = "📰 <b>Khobor Shunbi? - আজকের তাজা খবর</b>\n"
            final_message += "━━━━━━━━━━━━━━━━━━━━\n\n"
            
            for index, news in enumerate(news_data[:5]): 
                title = news.get('title', 'শিরোনাম পাওয়া যায়নি')
                details = news.get('details', 'বিস্তারিত জানতে লিংকে ক্লিক করুন')
                link = news.get('url', 'https://khobor-shunbi.vercel.app/')
                
                short_details = details[:120] + "..." if len(details) > 120 else details
                
                final_message += f"<b>{index + 1}. {title}</b>\n"
                final_message += f"📝 <i>{short_details}</i>\n"
                final_message += f"🔗 <a href='{link}'>বিস্তারিত পড়ুন</a>\n\n"
            
            await processing_msg.delete()
            await update.message.reply_text(final_message, parse_mode='HTML', disable_web_page_preview=True, reply_markup=get_webapp_keyboard())
            
        else:
            await processing_msg.edit_text("❌ <b>Error:</b> Could not load news at this moment.", parse_mode='HTML', reply_markup=get_webapp_keyboard())
            
    except Exception as e:
        print(f"[Error] Fetching news failed: {e}")
        await processing_msg.edit_text("❌ <b>Error:</b> Server connection failed.", parse_mode='HTML', reply_markup=get_webapp_keyboard())

import yt_dlp
# ... (বাকি কোড)

async def yt(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # ইউজার লিংকের সাথে কমান্ড দিয়েছে কি না তা চেক করা
    if not context.args:
        await update.message.reply_text("⚠️ <b>ব্যবহারবিধি:</b> /yt &lt;video_link&gt;\n<i>উদাহরণ: /yt https://youtu.be/...</i>", parse_mode='HTML')
        return

    url = context.args[0]
    processing_msg = await update.message.reply_text("⏳ <i>ভিডিও প্রসেস হচ্ছে, দয়া করে অপেক্ষা করুন...</i>", parse_mode='HTML')

    try:
        # টেলিগ্রামের ফাইল সাইজ লিমিট 50MB, তাই আমরা 45MB এর নিচের সেরা কোয়ালিটির ভিডিও খুঁজব
        ydl_opts = {
            'format': 'best[ext=mp4][filesize<=45M]/worst[ext=mp4]',
            'outtmpl': 'video_%(id)s.%(ext)s',
            'quiet': True,
            'noplaylist': True,
        }

        # ভিডিও ডাউনলোড করা
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)

        await processing_msg.edit_text("📤 <i>টেলিগ্রামে আপলোড করা হচ্ছে...</i>", parse_mode='HTML')

        # ইউজারের কাছে ভিডিও পাঠানো
        with open(filename, 'rb') as video_file:
            title = info.get('title', 'Downloaded Video')
            caption = f"🎬 <b>{title}</b>" 
            await update.message.reply_video(video=video_file, caption=caption, parse_mode='HTML')

        # সার্ভার থেকে ফাইলটি মুছে ফেলা (যাতে Render-এর ফ্রি স্টোরেজ ফুল না হয়)
        os.remove(filename)
        await processing_msg.delete()

    except Exception as e:
        print(f"[Error] Media Download Failed: {e}")
        await processing_msg.edit_text("❌ <b>Error:</b> ভিডিওটি ডাউনলোড করা সম্ভব হয়নি। ভিডিওর সাইজ ৫০MB এর বেশি হতে পারে বা লিংকটি প্রাইভেট।", parse_mode='HTML')

if __name__ == '__main__':
    print("🌐 Starting Flask dummy server for Render...")
    # Flask সার্ভারটিকে ব্যাকগ্রাউন্ড থ্রেডে রান করানো হচ্ছে
    threading.Thread(target=run_dummy_server, daemon=True).start()

    print("🚀 Initializing Bot...")
    try:
        app = ApplicationBuilder().token(TOKEN).build()

        app.add_handler(CommandHandler("start", start))
        app.add_handler(CommandHandler("about", about))
        app.add_handler(CommandHandler("projects", projects))
        app.add_handler(CommandHandler("ai_works", ai_works))
        app.add_handler(CommandHandler("contact", contact))
        app.add_handler(CommandHandler("khobor", khobor))
        app.add_handler(CommandHandler("yt", yt))

        print("✅ Bot is running successfully! Press Ctrl+C to stop.")
        app.run_polling()
    except Exception as e:
        print(f"❌ Failed to start bot: {e}")