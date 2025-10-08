
// app.js - static site script to render courses and handle contact form
async function loadJSON(path){
  const res = await fetch(path);
  return res.json();
}

function el(html){ const div=document.createElement('div'); div.innerHTML=html.trim(); return div.firstChild; }

async function renderFeatured(){
  const courses = await loadJSON('courses.json');
  const featured = courses.slice(0,3);
  const container = document.getElementById('featured-list');
  if(!container) return;
  container.innerHTML = featured.map(c => `
    <article class="card">
      <h4>${c.title}</h4>
      <p>${c.description}</p>
      <p><strong>Duration:</strong> ${c.duration} • <strong>Price:</strong> ${c.price}</p>
      <p><a href="course.html?id=${c.id}">View</a></p>
    </article>
  `).join('\\n');
}

async function renderCourses(){
  const courses = await loadJSON('courses.json');
  const container = document.getElementById('courses-list');
  if(!container) return;
  container.innerHTML = courses.map(c => `
    <article class="card">
      <h3>${c.title}</h3>
      <p>${c.description}</p>
      <p><strong>Duration:</strong> ${c.duration} • <strong>Price:</strong> ${c.price}</p>
      <p><a href="course.html?id=${c.id}">Learn more</a></p>
    </article>
  `).join('\\n');
}

async function renderCourseDetail(){
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'));
  if(!id) return;
  const courses = await loadJSON('courses.json');
  const c = courses.find(x=>x.id===id);
  const container = document.getElementById('course-detail');
  if(!container || !c) return;
  container.innerHTML = `
    <h2>${c.title}</h2>
    <p>${c.description}</p>
    <p><strong>Duration:</strong> ${c.duration}</p>
    <p><strong>Price:</strong> ${c.price}</p>
    <p><a href="contact.html">Enquire / Enroll</a></p>
  `;
}

function setupContact(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    // For static site, we'll store enquiries in localStorage and show confirmation
    const list = JSON.parse(localStorage.getItem('enquiries')||'[]');
    list.push({...data, created_at: new Date().toISOString()});
    localStorage.setItem('enquiries', JSON.stringify(list));
    document.getElementById('contact-result').textContent = 'Thanks — your message has been saved locally (static demo).';
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderFeatured();
  renderCourses();
  renderCourseDetail();
  setupContact();
  console.log('Static AS Info Solution loaded');
});
