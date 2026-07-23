// استيراد الإعدادات من ملف الفايربيس
import { auth, db } from './firebase.js';

// عنصر التطبيق الأساسي في HTML
const appDiv = document.getElementById('app');

// دالة عرض واجهة الطالب الرئيسية
function renderStudentDashboard() {
  appDiv.innerHTML = `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex">
      
      <!-- القائمة الجانبية -->
      <aside class="w-72 bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div class="flex items-center gap-3 mb-10">
            <div class="bg-sky-500 text-slate-950 font-bold p-2.5 rounded-xl">
              <i class="fa-solid fa-graduation-cap text-xl"></i>
            </div>
            <h1 class="text-xl font-bold tracking-wide">بوابة الطالب الذكية</h1>
          </div>

          <nav class="space-y-2">
            <button id="nav-courses" class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition font-medium bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20">
              <i class="fa-solid fa-play-circle text-lg"></i>
              <span>كورساتي المفعلة</span>
            </button>
            <button id="nav-exams" class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition font-medium hover:bg-slate-800/60 text-slate-400">
              <i class="fa-solid fa-clipboard-question text-lg"></i>
              <span>الاختبارات والواجبات</span>
            </button>
          </nav>
        </div>

        <div class="border-t border-slate-800/80 pt-4">
          <button id="logout-btn" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition font-medium">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <!-- محتوى الصفحة الرئيسي -->
      <main class="flex-1 p-6 md:p-10 overflow-y-auto">
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-800/60">
          <div>
            <h2 class="text-3xl font-extrabold text-white tracking-tight">أهلاً بك يا بطل! 👋</h2>
            <p class="text-slate-400 mt-1">تابع دروسك وحل واجباتك لتكون في صدارة الطلاب.</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-md">
            <div class="w-10 h-10 bg-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center font-bold">
              ط
            </div>
            <div>
              <h4 class="text-sm font-bold text-white">محمد أحمد</h4>
              <span class="text-xs text-sky-400 font-medium">الصف الثالث الثانوي</span>
            </div>
          </div>
        </header>

        <!-- قسم الكورسات -->
        <div id="content-area">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-book-open text-sky-400"></i>
              الكورسات المتاحة لك حالياً
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- كارت الكورس 1 -->
            <div class="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-sky-500/50 transition duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div class="h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-sky-400 relative">
                  <i class="fa-solid fa-play-circle text-5xl opacity-80"></i>
                  <span class="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-xs text-slate-300 px-3 py-1 rounded-full border border-slate-800">
                    ساعة ونصف
                  </span>
                </div>
                <div class="p-6">
                  <span class="text-xs bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full font-bold border border-sky-500/20">
                    مادة الفيزياء
                  </span>
                  <h3 class="text-lg font-bold text-white mt-3">محاضرة قوانين نيوتن والحرارة</h3>
                  <p class="text-slate-400 text-sm mt-2 leading-relaxed">شرح تفصيلي مع حل أمثلة الامتحانات السابقة وأهم التكات.</p>
                </div>
              </div>
              <div class="p-6 pt-0">
                <button class="w-full bg-sky-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-sky-400 transition shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2">
                  <i class="fa-solid fa-play"></i>
                  <span>مشاهدة المحاضرة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}

// تشغيل الواجهة عند فتح الموقع
renderStudentDashboard();
