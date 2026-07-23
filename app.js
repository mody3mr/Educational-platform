// استيراد دوال الفايربيس من الـ CDN
import { auth, db } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const appDiv = document.getElementById('app');

// 1. مراقبة حالة المستخدم (هل هو مسجل دخول ولا لأ؟)
onAuthStateChanged(auth, (user) => {
  if (user) {
    // لو مسجل دخول، اعرض له لوحة التحكم والكورسات
    renderStudentDashboard(user);
  } else {
    // لو مش مسجل، اعرض له صفحة تسجيل الدخول
    renderLoginView();
  }
});

// 2. واجهة تسجيل الدخول
function renderLoginView() {
  appDiv.innerHTML = `
    <div style="direction: rtl; font-family: 'Cairo', sans-serif;" class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl border border-sky-500/20">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <h1 class="text-2xl font-bold text-white">تسجيل الدخول للمنصة</h1>
          <p class="text-slate-400 text-sm mt-2">ادخل بيانات حسابك لمتابعة دروسك</p>
        </div>

        <form id="login-form" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني</label>
            <input type="email" id="email" required placeholder="name@example.com" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
            <input type="password" id="password" required placeholder="••••••••" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition" />
          </div>

          <button type="submit" class="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2">
            <span>دخول</span>
          </button>
        </form>

        <div id="error-msg" class="text-red-400 text-sm mt-4 text-center font-medium"></div>
      </div>
    </div>
  `;

  // تفعيل زر تسجيل الدخول
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      errorMsg.innerText = "❌ البريد الإلكتروني أو كلمة المرور غير صحيحة!";
    }
  });
}

// 3. لوحة تحكم الطالب (جلب الكورسات الحقيقية من Firestore)
async function renderStudentDashboard(user) {
  appDiv.innerHTML = `
    <div style="direction: rtl; font-family: 'Cairo', sans-serif;" class="min-h-screen bg-slate-950 text-slate-100 flex">
      
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
            <button class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition font-medium bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20">
              <i class="fa-solid fa-play-circle text-lg"></i>
              <span>كورساتي المفعلة</span>
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
            <p class="text-slate-400 mt-1">الحساب: <span class="text-sky-400 font-semibold">${user.email}</span></p>
          </div>
        </header>

        <!-- قسم الكورسات -->
        <div>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-book-open text-sky-400"></i>
              الكورسات المتاحة لك من قاعدة البيانات
            </h3>
          </div>

          <div id="courses-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <p class="text-slate-400">جاري تحميل الكورسات...</p>
          </div>
        </div>
      </main>
    </div>
  `;

  // زر تسجيل الخروج
  document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth);
  });

  // جلب الكورسات من جدول (courses) في فايربيس
  const coursesGrid = document.getElementById('courses-grid');
  try {
    const querySnapshot = await getDocs(collection(db, "courses"));
    if (querySnapshot.empty) {
      coursesGrid.innerHTML = `<p class="text-slate-400 col-span-3">لا توجد كورسات مضافة حالياً في قاعدة البيانات.</p>`;
      return;
    }

    let html = '';
    querySnapshot.forEach((doc) => {
      const course = doc.data();
      html += `
        <div class="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-sky-500/50 transition duration-300 flex flex-col justify-between shadow-xl">
          <div>
            <div class="h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-sky-400 relative">
              <i class="fa-solid fa-play-circle text-5xl opacity-80"></i>
            </div>
            <div class="p-6">
              <span class="text-xs bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full font-bold border border-sky-500/20">
                ${course.subject || 'مادة دراسية'}
              </span>
              <h3 class="text-lg font-bold text-white mt-3">${course.title || 'محاضرة جديدة'}</h3>
              <p class="text-slate-400 text-sm mt-2 leading-relaxed">${course.description || 'لا يوجد وصف متاح.'}</p>
            </div>
          </div>
          <div class="p-6 pt-0">
            <button class="w-full bg-sky-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-sky-400 transition shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2">
              <i class="fa-solid fa-play"></i>
              <span>مشاهدة المحاضرة</span>
            </button>
          </div>
        </div>
      `;
    });
    coursesGrid.innerHTML = html;
  } catch (err) {
    coursesGrid.innerHTML = `<p class="text-red-400">حدث خطأ أثناء تحميل الكورسات. تأكد من إعدادات قاعدة البيانات.</p>`;
  }
}
