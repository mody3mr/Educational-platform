import { auth, db } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const appDiv = document.getElementById('app');

// مراقبة حالة تسجيل الدخول
onAuthStateChanged(auth, (user) => {
  if (user) {
    renderAdminDashboard(user);
  } else {
    renderLoginView();
  }
});

// 1. واجهة تسجيل الدخول
function renderLoginView() {
  appDiv.innerHTML = `
    <div style="direction: rtl; font-family: 'Cairo', sans-serif;" class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl border border-sky-500/20">
            <i class="fa-solid fa-chalkboard-user"></i>
          </div>
          <h1 class="text-2xl font-bold text-white">لوحة تحكم المدرس</h1>
          <p class="text-slate-400 text-sm mt-2">سجل دخولك لإدارة المنصة والكورسات</p>
        </div>

        <form id="login-form" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني</label>
            <input type="email" id="email" required placeholder="admin@example.com" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
            <input type="password" id="password" required placeholder="••••••••" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition" />
          </div>

          <button type="submit" class="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2">
            <span>تسجيل الدخول</span>
          </button>
        </form>

        <div id="error-msg" class="text-red-400 text-sm mt-4 text-center font-medium"></div>
      </div>
    </div>
  `;

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

// 2. لوحة التحكم والإدارة للمدرس
async function renderAdminDashboard(user) {
  appDiv.innerHTML = `
    <div style="direction: rtl; font-family: 'Cairo', sans-serif;" class="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      <!-- القائمة الجانبية -->
      <aside class="w-full md:w-72 bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-10">
            <div class="bg-sky-500 text-slate-950 font-bold p-2.5 rounded-xl">
              <i class="fa-solid fa-chalkboard-user text-xl"></i>
            </div>
            <h1 class="text-xl font-bold tracking-wide">إدارة المنصة</h1>
          </div>

          <nav class="space-y-2">
            <button class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition font-medium bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20">
              <i class="fa-solid fa-book-bookmark text-lg"></i>
              <span>إدارة الكورسات</span>
            </button>
          </nav>
        </div>

        <div class="border-t border-slate-800/80 pt-4 mt-6">
          <button id="logout-btn" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition font-medium">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <!-- محتوى لوحة التحكم -->
      <main class="flex-1 p-6 md:p-10 overflow-y-auto">
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-800/60">
          <div>
            <h2 class="text-3xl font-extrabold text-white tracking-tight">أهلاً بك يا استشاري التعليم 👋</h2>
            <p class="text-slate-400 mt-1">تحكم في محتوى المنصة وإضافة الدروس للطلاب مباشرة.</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-md">
            <div class="w-10 h-10 bg-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center font-bold">
              م
            </div>
            <div>
              <h4 class="text-sm font-bold text-white">المدرس المسؤول</h4>
              <span class="text-xs text-sky-400 font-medium">${user.email}</span>
            </div>
          </div>
        </header>

        <!-- نموذج إضافة كورس جديد -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10 shadow-xl">
          <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <i class="fa-solid fa-plus-circle text-sky-400"></i>
            إضافة محاضرة أو كورس جديد
          </h3>
          <form id="add-course-form" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" id="course-title" placeholder="عنوان المحاضرة (مثال: الباب الأول فيزياء)" required class="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
            <input type="text" id="course-subject" placeholder="اسم المادة (مثال: الفيزياء)" required class="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
            <input type="text" id="course-desc" placeholder="وصف مبسط للمحتوى" required class="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
            <button type="submit" class="md:col-span-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <span>نشر الكورس على المنصة</span>
            </button>
          </form>
        </div>

        <!-- عرض الكورسات الحالية مع زر الحذف -->
        <div>
          <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <i class="fa-solid fa-list-check text-sky-400"></i>
            الكورسات الحالية المتاحة للطلاب
          </h3>
          <div id="courses-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <p class="text-slate-400">جاري تحميل الكورسات...</p>
          </div>
        </div>
      </main>
    </div>
  `;

  // تسجيل الخروج
  document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth);
  });

  // إضافة كورس جديد لقاعدة البيانات
  document.getElementById('add-course-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('course-title').value;
    const subject = document.getElementById('course-subject').value;
    const description = document.getElementById('course-desc').value;

    try {
      await addDoc(collection(db, "courses"), {
        title,
        subject,
        description,
        createdAt: new Date()
      });
      document.getElementById('add-course-form').reset();
      loadCourses(); // تحديث القائمة تلقائياً
    } catch (err) {
      alert("حدث خطأ أثناء إضافة الكورس!");
    }
  });

  loadCourses();
}

// دالة جلب وعرض الكورسات مع خيار الحذف
async function loadCourses() {
  const coursesList = document.getElementById('courses-list');
  if (!coursesList) return;

  try {
    const querySnapshot = await getDocs(collection(db, "courses"));
    if (querySnapshot.empty) {
      coursesList.innerHTML = `<p class="text-slate-400 col-span-3">لا توجد كورسات مضافة حالياً.</p>`;
      return;
    }

    let html = '';
    querySnapshot.forEach((documentSnap) => {
      const course = documentSnap.data();
      const courseId = documentSnap.id;

      html += `
        <div class="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-sky-500/50 transition duration-300 flex flex-col justify-between shadow-xl">
          <div class="p-6">
            <span class="text-xs bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full font-bold border border-sky-500/20">
              ${course.subject}
            </span>
            <h3 class="text-lg font-bold text-white mt-3">${course.title}</h3>
            <p class="text-slate-400 text-sm mt-2 leading-relaxed">${course.description}</p>
          </div>
          <div class="p-6 pt-0">
            <button onclick="window.deleteCourse('${courseId}')" class="w-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold py-3 rounded-xl hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2">
              <i class="fa-solid fa-trash"></i>
              <span>حذف الكورس</span>
            </button>
          </div>
        </div>
      `;
    });
    coursesList.innerHTML = html;
  } catch (err) {
    coursesList.innerHTML = `<p class="text-red-400">فشل في تحميل الكورسات.</p>`;
  }
}

// دالة حذف الكورس من فايربيس
window.deleteCourse = async function(id) {
  if (confirm("هل أنت متأكد من حذف هذا الكورس نهائياً؟")) {
    try {
      await deleteDoc(doc(db, "courses", id));
      loadCourses();
    } catch (err) {
      alert("حدث خطأ أثناء الحذف!");
    }
}
};
