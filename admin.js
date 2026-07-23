import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const appDiv = document.getElementById('app');

onAuthStateChanged(auth, (user) => {
  if (user) {
    renderAdminDashboard(user);
  } else {
    renderLoginView();
  }
});

function renderLoginView() {
  appDiv.innerHTML = `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl border border-sky-500/20">
            <i class="fa-solid fa-chalkboard-user"></i>
          </div>
          <h1 class="text-2xl font-bold text-white">تسجيل دخول المدرس</h1>
          <p class="text-slate-400 text-sm mt-2">ادخل بيانات حساب الأدمن</p>
        </div>
        <form id="login-form" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني</label>
            <input type="email" id="email" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
            <input type="password" id="password" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
          </div>
          <button type="submit" class="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3.5 rounded-xl transition">دخول</button>
        </form>
        <div id="error-msg" class="text-red-400 text-sm mt-4 text-center"></div>
      </div>
    </div>
  `;
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      document.getElementById('error-msg').innerText = "❌ البريد أو كلمة المرور غير صحيحة";
    }
  });
}

function renderAdminDashboard(user) {
  appDiv.innerHTML = `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <aside class="w-full md:w-72 bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-10">
            <div class="bg-sky-500 text-slate-950 font-bold p-2.5 rounded-xl">
              <i class="fa-solid fa-chalkboard-user text-xl"></i>
            </div>
            <h1 class="text-xl font-bold">إدارة المنصة</h1>
          </div>
        </div>
        <div>
          <button id="logout-btn" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition">
            <i class="fa-solid fa-right-from-bracket"></i> تسجيل الخروج
          </button>
        </div>
      </aside>
      <main class="flex-1 p-6 md:p-10 overflow-y-auto">
        <header class="flex justify-between items-center mb-10 pb-6 border-b border-slate-800">
          <h2 class="text-3xl font-bold text-white">لوحة تحكم المدرس</h2>
          <span class="text-sky-400 text-sm">${user.email}</span>
        </header>
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10">
          <h3 class="text-xl font-bold text-white mb-4">إضافة كورس جديد</h3>
          <form id="add-course-form" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" id="course-title" placeholder="عنوان المحاضرة" required class="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
            <input type="text" id="course-subject" placeholder="اسم المادة" required class="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
            <input type="text" id="course-desc" placeholder="الوصف" required class="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
            <button type="submit" class="md:col-span-3 bg-sky-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-sky-400 transition">نشر الكورس</button>
          </form>
        </div>
        <div>
          <h3 class="text-xl font-bold text-white mb-4">الكورسات المتاحة</h3>
          <div id="courses-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        </div>
      </main>
    </div>
  `;
  document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));
  document.getElementById('add-course-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('course-title').value;
    const subject = document.getElementById('course-subject').value;
    const description = document.getElementById('course-desc').value;
    await addDoc(collection(db, "courses"), { title, subject, description });
    document.getElementById('add-course-form').reset();
    loadCourses();
  });
  loadCourses();
}

async function loadCourses() {
  const list = document.getElementById('courses-list');
  if (!list) return;
  const querySnapshot = await getDocs(collection(db, "courses"));
  let html = '';
  querySnapshot.forEach((docSnap) => {
    const c = docSnap.data();
    const id = docSnap.id;
    html += `
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <span class="text-xs bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full">${c.subject}</span>
          <h4 class="text-lg font-bold text-white mt-3">${c.title}</h4>
          <p class="text-slate-400 text-sm mt-2">${c.description}</p>
        </div>
        <button onclick="window.deleteCourse('${id}')" class="mt-6 w-full bg-red-500/10 text-red-400 font-bold py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition">حذف</button>
      </div>
    `;
  });
  list.innerHTML = html || '<p class="text-slate-400">لا توجد كورسات</p>';
}

window.deleteCourse = async function(id) {
  if (confirm("هل تريد حذف الكورس؟")) {
    await deleteDoc(doc(db, "courses", id));
    loadCourses();
  }
};
