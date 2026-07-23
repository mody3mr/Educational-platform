import { auth, db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const appDiv = document.getElementById('app');

async function renderStudentPortal() {
  appDiv.innerHTML = `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside class="w-72 bg-slate-900 border-l border-slate-800 p-6 hidden md:flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-10">
            <div class="bg-sky-500 text-slate-950 font-bold p-2.5 rounded-xl">
              <i class="fa-solid fa-graduation-cap text-xl"></i>
            </div>
            <h1 class="text-xl font-bold">بوابة الطالب</h1>
          </div>
        </div>
      </aside>
      <main class="flex-1 p-6 md:p-10 overflow-y-auto">
        <header class="mb-10 pb-6 border-b border-slate-800">
          <h2 class="text-3xl font-bold text-white">كورساتي المفعلة</h2>
          <p class="text-slate-400 mt-1">تابع أحدث المحاضرات المضافة من المدرس</p>
        </header>
        <div id="courses-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <p class="text-slate-400">جاري التحميل...</p>
        </div>
      </main>
    </div>
  `;

  const grid = document.getElementById('courses-grid');
  try {
    const querySnapshot = await getDocs(collection(db, "courses"));
    if (querySnapshot.empty) {
      grid.innerHTML = `<p class="text-slate-400">لا توجد كورسات متاحة حالياً.</p>`;
      return;
    }
    let html = '';
    querySnapshot.forEach((doc) => {
      const c = doc.data();
      html += `
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <span class="text-xs bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full">${c.subject || 'مادة'}</span>
            <h3 class="text-lg font-bold text-white mt-3">${c.title}</h3>
            <p class="text-slate-400 text-sm mt-2">${c.description}</p>
          </div>
          <button class="mt-6 w-full bg-sky-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-sky-400 transition flex items-center justify-center gap-2">
            <i class="fa-solid fa-play"></i> مشاهدة المحاضرة
          </button>
        </div>
      `;
    });
    grid.innerHTML = html;
  } catch (err) {
    grid.innerHTML = `<p class="text-red-400">حدث خطأ في تحميل الكورسات.</p>`;
  }
}

renderStudentPortal();
