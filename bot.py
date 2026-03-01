import os
import json
import requests
import threading
import yt_dlp
import pytz
from datetime import datetime, timedelta
from upstash_redis import Redis
from flask import Flask
from dotenv import load_dotenv
from telegram import Update, KeyboardButton, ReplyKeyboardMarkup, InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardRemove, WebAppInfo
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters, CallbackQueryHandler

# Load environment variables
load_dotenv('.env.local')
TOKEN = os.getenv('TOKEN')
WEB_APP_URL = 'https://rahim-saroar.vercel.app/'

# Upstash Redis Connection
redis = Redis(url=os.getenv('UPSTASH_REDIS_REST_URL'), token=os.getenv('UPSTASH_REDIS_REST_TOKEN'))

# --- Dummy Web Server using Flask (Render Free Tier Hack) ---
web_app = Flask(__name__)

@web_app.route('/')
def home():
    return "🤖 Bot is successfully running on Render!"

def run_dummy_server():
    port = int(os.environ.get('PORT', 10000))
    web_app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)
# -------------------------------------------------------------

# Web App Button Function
def get_webapp_keyboard():
    keyboard = [[InlineKeyboardButton("🚀 Open Portfolio App", web_app=WebAppInfo(url=WEB_APP_URL))]]
    return InlineKeyboardMarkup(keyboard)

# --- Basic Bot Commands ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "👋 <b>স্বাগতম আমার ডিজিটাল ওয়ার্ল্ডে!</b>\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "আমি <b>রহিম সারোয়ার মিশু</b>, একজন Full Stack Developer এবং AI Enthusiast।\n\n"
        "আমার তৈরি করা প্রজেক্ট, AI টুলস এবং পোর্টফোলিও দেখতে নিচের বাটনটিতে ক্লিক করে সরাসরি অ্যাপটি এক্সপ্লোর করতে পারেন।"
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
            final_message = "📰 <b>Khobor Shunbi? - আজকের তাজা খবর</b>\n━━━━━━━━━━━━━━━━━━━━\n\n"
            for index, news in enumerate(news_data[:5]): 
                title = news.get('title', 'শিরোনাম পাওয়া যায়নি')
                details = news.get('details', 'বিস্তারিত জানতে লিংকে ক্লিক করুন')
                link = news.get('url', 'https://khobor-shunbi.vercel.app/')
                short_details = details[:120] + "..." if len(details) > 120 else details
                final_message += f"<b>{index + 1}. {title}</b>\n📝 <i>{short_details}</i>\n🔗 <a href='{link}'>বিস্তারিত পড়ুন</a>\n\n"
            await processing_msg.delete()
            await update.message.reply_text(final_message, parse_mode='HTML', disable_web_page_preview=True, reply_markup=get_webapp_keyboard())
        else:
            await processing_msg.edit_text("❌ <b>Error:</b> Could not load news at this moment.", parse_mode='HTML', reply_markup=get_webapp_keyboard())
    except Exception as e:
        await processing_msg.edit_text("❌ <b>Error:</b> Server connection failed.", parse_mode='HTML', reply_markup=get_webapp_keyboard())

# --- YT Downloader ---
async def yt(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("⚠️ <b>ব্যবহারবিধি:</b> /yt &lt;video_link&gt;", parse_mode='HTML')
        return
    url = context.args[0]
    processing_msg = await update.message.reply_text("⏳ <i>ভিডিও প্রসেস হচ্ছে, অপেক্ষা করুন...</i>", parse_mode='HTML')
    try:
        ydl_opts = {'format': 'best[ext=mp4][filesize<=45M]/worst[ext=mp4]', 'outtmpl': 'video_%(id)s.%(ext)s', 'quiet': True, 'noplaylist': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
        await processing_msg.edit_text("📤 <i>টেলিগ্রামে আপলোড করা হচ্ছে...</i>", parse_mode='HTML')
        with open(filename, 'rb') as video_file:
            await update.message.reply_video(video=video_file, caption=f"🎬 <b>{info.get('title', 'Downloaded Video')}</b>", parse_mode='HTML')
        os.remove(filename)
        await processing_msg.delete()
    except Exception as e:
        await processing_msg.edit_text("❌ <b>Error:</b> ভিডিওটি ডাউনলোড করা সম্ভব হয়নি।", parse_mode='HTML')

# --- Ramadan Assistant ---
RAMADAN_CONTENT = {
    "sehri_dua": "<b>সেহরির নিয়ত:</b>\nنَوَيْتُ اَنْ اُصُوْمَ غَدًا مِّنْ شَهْرِ رَمْضَانَ الْمُبَارَكِ فَرْضَا لَكَ يَا اللهُ فَتَقَبَّل مِنِّى اِنَّكَ اَنْتَ السَّمِيْعُ الْعَلِيْم\n\n<b>উচ্চারণ:</b> নাওয়াইতু আন আসুমা গাদাম মিন শাহরি রামাদানাল মুবারাকি ফারদাল্লাকা ইয়া আল্লাহু ফাতাকাব্বাল মিন্নি ইন্নাকা আনতাস সামিউল আলিম।",
    "iftar_dua": "<b>ইফতারের দোয়া:</b>\nاَللَّهُمَّ لَكَ صُمْتُ وَ عَلَى رِزْقِكَ اَفْطَرْتُ\n\n<b>উচ্চারণ:</b> আল্লাহুম্মা লাকা subhту ওয়া আলা রিযক্বিকা আফতারতু।",
    "rakaats": {
        "Fajr": "ফজর: ২ রাকাত সুন্নত, ২ রাকাত ফরজ (মোট ৪ রাকাত)।",
        "Dhuhr": "যোহর: ৪ সুন্নত, ৪ ফরজ, ২ সুন্নত, ২ নফল (মোট ১২ রাকাত)।",
        "Asr": "আসর: ৪ সুন্নত, ৪ ফরজ (মোট ۸ রাকাত)।",
        "Maghrib": "মাগরিব: ৩ ফরজ, ২ সুন্নত, ২ নফল (মোট ৭ রাকাত)।",
        "Isha": "এশা ও তারাবিহ: ৪ সুন্নত, ৪ ফরজ, ২ সুন্নত, ২ নফল, ৩ বিতর (মোট ১৫ রাকাত) এবং ২০ রাকাত তারাবিহ।"
    }
}

def get_city_name(lat, lon):
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=10"
        headers = {'User-Agent': 'MishuPortfolioBot/1.0'}
        res = requests.get(url, headers=headers).json()
        address = res.get('address', {})
        city = address.get('city') or address.get('state') or address.get('country')
        return city if city else "অজানা লোকেশন"
    except:
        return "আপনার বর্তমান লোকেশন"

def get_prayer_times(lat, lon):
    url = f"http://api.aladhan.com/v1/timings?latitude={lat}&longitude={lon}&method=1"
    res = requests.get(url).json()['data']
    return {"timings": res['timings'], "timezone": res['meta']['timezone'], "date": res['date']['gregorian']['date']}

def subtract_minutes(time_str, mins):
    t = datetime.strptime(time_str, "%H:%M")
    return (t - timedelta(minutes=mins)).strftime("%H:%M")

async def ramadan(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[KeyboardButton("📍 লোকেশন শেয়ার করে সময় দেখুন", request_location=True)]]
    reply_markup = ReplyKeyboardMarkup(keyboard, one_time_keyboard=True, resize_keyboard=True)
    await update.message.reply_text("🌙 আপনার এলাকার সঠিক সেহরি ও ইফতারের সময় জানতে লোকেশন শেয়ার করুন:", reply_markup=reply_markup)

async def handle_location(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    lat = update.message.location.latitude
    lon = update.message.location.longitude
    
    processing_msg = await update.message.reply_text("⏳ <i>আপনার এলাকার সময়সূচি বের করা হচ্ছে...</i>", parse_mode='HTML', reply_markup=ReplyKeyboardRemove())
    
    city = get_city_name(lat, lon)
    api_data = get_prayer_times(lat, lon)
    timings = api_data['timings']
    
    user_data = {"lat": lat, "lon": lon, "city": city, "timezone": api_data['timezone'], "notify": "on", "last_updated": api_data['date'], "timings": timings}
    redis.set(f"user_ramadan:{user_id}", json.dumps(user_data))
    
    text = f"📍 <b>লোকেশন:</b> {city}\n━━━━━━━━━━━━━━━━━━\n"
    text += f"🕰️ <b>সেহরির শেষ সময়:</b> {timings['Imsak']}\n🕌 <b>ফজর:</b> {timings['Fajr']}\n🕌 <b>যোহর:</b> {timings['Dhuhr']}\n"
    text += f"🕌 <b>আসর:</b> {timings['Asr']}\n🍽️ <b>ইফতার (মাগরিব):</b> {timings['Maghrib']}\n🕌 <b>এশা:</b> {timings['Isha']}\n━━━━━━━━━━━━━━━━━━"
    
    keyboard = [[InlineKeyboardButton("✅ রিমাইন্ডার চালু আছে", callback_data="rem_on")], [InlineKeyboardButton("❌ রিমাইন্ডার বন্ধ করুন", callback_data="rem_off")]]
    await processing_msg.delete()
    await update.message.reply_text(text, parse_mode='HTML', reply_markup=InlineKeyboardMarkup(keyboard))

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    user_id = query.from_user.id
    data = redis.get(f"user_ramadan:{user_id}")
    
    if data:
        user_data = json.loads(data)
        if query.data == "rem_off":
            user_data['notify'] = "off"
            redis.set(f"user_ramadan:{user_id}", json.dumps(user_data))
            await query.edit_message_reply_markup(reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("🔔 রিমাইন্ডার চালু করুন", callback_data="rem_on")]]))
            await context.bot.send_message(user_id, "🔕 আপনার রমজান রিমাইন্ডার বন্ধ করা হয়েছে।")
        elif query.data == "rem_on":
            user_data['notify'] = "on"
            redis.set(f"user_ramadan:{user_id}", json.dumps(user_data))
            await query.edit_message_reply_markup(reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("❌ রিমাইন্ডার বন্ধ করুন", callback_data="rem_off")]]))
            await context.bot.send_message(user_id, "🔔 আপনার রমজান রিমাইন্ডার পুনরায় চালু করা হয়েছে।")

async def check_alerts(context: ContextTypes.DEFAULT_TYPE):
    users = redis.keys("user_ramadan:*")
    for key in users:
        try:
            user_data = json.loads(redis.get(key))
            if user_data.get('notify') != "on":
                continue
                
            user_tz = pytz.timezone(user_data['timezone'])
            now = datetime.now(user_tz)
            current_time = now.strftime("%H:%M")
            current_date = now.strftime("%d-%m-%Y")
            
            if user_data['last_updated'] != current_date:
                api_data = get_prayer_times(user_data['lat'], user_data['lon'])
                user_data['timings'] = api_data['timings']
                user_data['last_updated'] = api_data['date']
                redis.set(key, json.dumps(user_data))
                
            timings = user_data['timings']
            user_id = key.split(":")[1]
            
            if current_time == subtract_minutes(timings['Imsak'], 5):
                await context.bot.send_message(chat_id=user_id, text=f"⏳ <b>সেহরির সময় শেষ হতে আর মাত্র ৫ মিনিট বাকি!</b>\nদ্রুত খাওয়া শেষ করে রোজার প্রস্তুতি নিন।\n\n{RAMADAN_CONTENT['sehri_dua']}", parse_mode='HTML')
            if current_time == subtract_minutes(timings['Maghrib'], 3):
                await context.bot.send_message(chat_id=user_id, text=f"⏳ <b>ইফতারের সময় হতে আর মাত্র ৩ মিনিট বাকি!</b>\nদোয়া পড়ুন এবং ইফতার সামনে নিয়ে বসুন।\n\n{RAMADAN_CONTENT['iftar_dua']}", parse_mode='HTML')
                
            for waqt in ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']:
                if current_time == timings[waqt]:
                    waqt_name_bn = {'Fajr':'ফজর', 'Dhuhr':'যোহর', 'Asr':'আসর', 'Maghrib':'মাগরিব', 'Isha':'এশা'}[waqt]
                    msg = f"🕌 <b>মাগরিবের নামাজের সময় শুরু হয়েছে এবং ইফতারের সময় হয়েছে!</b>\n\n{RAMADAN_CONTENT['rakaats'][waqt]}" if waqt == 'Maghrib' else f"🕌 <b>{waqt_name_bn} নামাজের সময় শুরু হয়েছে!</b>\nনামাজের জন্য প্রস্তুতি নিন।\n\n{RAMADAN_CONTENT['rakaats'][waqt]}"
                    await context.bot.send_message(chat_id=user_id, text=msg, parse_mode='HTML')
        except Exception as e:
            print(f"Error alerting user {key}: {e}")

if __name__ == '__main__':
    print("🌐 Starting Flask dummy server for Render...")
    threading.Thread(target=run_dummy_server, daemon=True).start()

    print("🚀 Initializing Bot...")
    try:
        app = ApplicationBuilder().token(TOKEN).build()

        app.add_handler(CommandHandler("start", start))
        app.add_handler(CommandHandler("contact", contact))
        app.add_handler(CommandHandler("khobor", khobor))
        app.add_handler(CommandHandler("yt", yt))
        app.add_handler(CommandHandler("ramadan", ramadan))
        app.add_handler(MessageHandler(filters.LOCATION, handle_location))
        app.add_handler(CallbackQueryHandler(button_handler))

        app.job_queue.run_repeating(check_alerts, interval=60, first=10)

        print("✅ Bot is running successfully! Press Ctrl+C to stop.")
        app.run_polling()
    except Exception as e:
        print(f"❌ Failed to start bot: {e}")