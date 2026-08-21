const categories = (window.AWEEXP_PROJECTS || []).map(x => x);
const projects = categories.flatMap(c => c.projects.map(p => ({...p,type:p.type||c.type,label:p.label||c.label,icon:p.icon||c.icon})));
const grid = document.querySelector('#project-grid');
const empty = document.querySelector('#empty');
const search = document.querySelector('#search');
const filter = document.querySelector('#type-filter');

function injectAWEHubNav(){
  if(document.querySelector('#aweHubNav'))return;
  const nav=document.querySelector('.topbar nav');
  if(!nav)return;
  [['AWE A2Z','https://awe-a2z.pages.dev/'],['AWEEXP','https://awe-exp.pages.dev/'],['AWEGame','https://awegame.pages.dev/'],['AWEARCHIVE','https://awearchive.pages.dev/']].forEach(([name,url],i)=>{const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.textContent=name;a.id=i===0?'aweHubNav':`aweHub-${i}`;nav.appendChild(a)});
}
injectAWEHubNav();
categories.forEach(c => { const o=document.createElement('option'); o.value=c.type; o.textContent=c.label; filter.appendChild(o); });
document.querySelector('#stat-projects').textContent = projects.length;
document.querySelector('#stat-types').textContent = categories.length;
document.querySelector('#category-grid').innerHTML = categories.map(c => `<a class="category" href="#discover" data-cat="${c.type}"><b>${c.icon} &nbsp;${c.label}</b><span>${c.projects.length} published</span></a>`).join('');
document.querySelectorAll('.category').forEach(a => a.addEventListener('click',()=>{filter.value=a.dataset.cat;render()}));
function render(){const q=search.value.trim().toLowerCase(), f=filter.value;const shown=projects.filter(p=>(f==='all'||p.type===f)&&(!q||[p.name,p.description,p.label,...(p.tags||[])].join(' ').toLowerCase().includes(q)));grid.innerHTML=shown.map(p=>`<article class="project" onclick="openProject('${encodeURIComponent(p.slug||p.name)}')"><div class="project-icon">${p.icon||'◇'}</div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description||'Open-source project')}</p><div class="project-meta"><span class="pill">${escapeHtml(p.label)}</span><span class="pill">OPEN SOURCE</span>${(p.tags||[]).slice(0,2).map(t=>`<span class="pill">${escapeHtml(t)}</span>`).join('')}</div></article>`).join('');empty.hidden=shown.length!==0;}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function openProject(slug){location.href='project.html?slug='+slug;}
search.addEventListener('input',render);filter.addEventListener('change',render);render();
