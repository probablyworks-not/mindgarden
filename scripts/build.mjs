import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
const content = JSON.parse(await readFile('src/content.json','utf8')).filter(entry => entry.kind !== 'writings');
const icons = JSON.parse(await readFile('src/assets/icons.json','utf8'));
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('src/assets','dist/assets',{recursive:true});
await cp('src/garden.js','dist/garden.js');
await writeFile('dist/styles.css',(await readFile('src/styles.css','utf8'))+'\n'+await readFile('src/enhancements.css','utf8'));
const svg = name => `<svg class="page-icon" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
const nav = `<nav class="internal-nav" aria-label="Main navigation"><a class="brand" href="/">mind<em>garden</em></a><div class="nav-links"><a href="/#products">Products</a><a href="/#work">Work</a><a href="/#intro">About</a></div></nav>`;
const socialLinks = JSON.parse(await readFile('src/social-links.json','utf8'));
const socialFooter = `<div class="footer-links social-links">${socialLinks.map(link => `<a href="${escape(link.url || '/contact/')}"${link.url ? '' : ' title="Contact details coming soon"'}>${escape(link.label)}</a>`).join('')}</div>`;
const footer = `<footer style="padding:32px 24px;text-align:center">${socialFooter}<p class="eyebrow">Nothing is finished. Everything is still becoming.</p></footer>`;
function document(title,description,body,home=false) {
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} — Mind Garden</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#FAFAF8"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css">${home?'<script type="module" src="/garden.js"></script>':''}<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript></head><body><a class="skip-link" href="#main-content">Skip to content</a>${body}</body></html>`;
}
async function page(path,text) { const dir='dist'+path; await mkdir(dir,{recursive:true}); await writeFile(dir+'index.html',text); }
await page('/',document('Yash Pagare','A garden of products, ideas, and thoughts by Yash Pagare.',(await readFile('src/home.html','utf8')).replace('{{SOCIAL_LINKS}}', socialFooter),true));
await writeFile('dist/assets/favicon.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#4C9A74" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${icons.Sprout}</svg>`);
for(const entry of content) {
 const group=content.filter(e=>e.kind===entry.kind),next=group[(group.indexOf(entry)+1)%group.length];
 const isWriting=entry.kind==='writings';
 const body=`${nav}<main id="main-content" class="page-shell"><article class="page-inner">${svg(isWriting?'Book':entry.kind==='ideas'?'Seed':'Sprout')}<p class="eyebrow">${escape(entry.kind)} · Placeholder</p><h1 class="page-title">${escape(entry.title)}</h1><p class="page-description">${escape(entry.description)}</p><section class="placeholder-note"><h2>${isWriting?'A little room for a thought.':'Still taking root.'}</h2><p>${isWriting?'There is no published essay here yet. This page is a placeholder for a future piece of writing.':'This is a placeholder from the original garden design. The full story, details, and links will be added here when they are ready.'}</p></section><div class="page-bottom"><a href="${isWriting?'/writings/':'/#products'}">← ${isWriting?'All writings':'Back to products & ideas'}</a><a href="${next.path}">Next: ${escape(next.title)} →</a></div></article></main>${footer}`;
 await page(entry.path,document(entry.title,entry.description,body));
}
for(const kind of ['products','ideas']) {
 const entries=content.filter(e=>e.kind===kind);
 await page('/'+kind+'/',document(kind[0].toUpperCase()+kind.slice(1),'Explore the '+kind+' in Mind Garden.',`${nav}<main id="main-content" class="page-shell"><div class="page-inner">${svg(kind==='writings'?'Book':'Sprout')}<p class="eyebrow">The garden</p><h1 class="page-title">${kind}</h1><p class="page-description">${kind==='writings'?'Nothing published yet. A few placeholder thoughts, waiting to grow.':'Things planted, ideas taking root. Placeholder details for now.'}</p><div class="entry-list">${entries.map(e=>`<a class="entry" href="${e.path}"><p class="eyebrow">Placeholder</p><h2>${escape(e.title)} ↗</h2><p>${escape(e.description)}</p></a>`).join('')}</div></div></main>${footer}`));
}
await page('/contact/',document('Get in touch','Contact details for Yash Pagare.',`${nav}<main id="main-content" class="page-shell"><div class="page-inner">${svg('Teacup')}<p class="eyebrow">Contact · Placeholder</p><h1 class="page-title">Leave a little hello.</h1><p class="page-description">A place for conversations, collaborations, and unexpected ideas.</p><section class="placeholder-note"><h2>Let’s start a conversation.</h2><p>You can reach me by email, LinkedIn, or WhatsApp using the links below.</p></section><a href="/">← Back to the garden</a></div></main>${footer}`));
await writeFile('dist/404.html',document('Page not found','This path has not been planted yet.',`${nav}<main id="main-content" class="page-shell"><div class="page-inner">${svg('Sprout')}<p class="eyebrow">404</p><h1 class="page-title">An unplanted path.</h1><p class="page-description">There is nothing growing here just yet.</p><a href="/">← Back to the garden</a></div></main>${footer}`));
console.log(`Built Mind Garden: homepage, ${content.length} detail pages, 2 collections, contact, and 404.`);
