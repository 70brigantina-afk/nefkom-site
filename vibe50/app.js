const $=s=>document.querySelector(s);
const PHOTO={
 beauty:"https://images.squarespace-cdn.com/content/v1/63ee8bdf1813a018d7bca28d/6df0af3f-3b74-402d-aa0e-3690db38356b/Gallery%2B-%2BHigh%2BRes-1.jpg",
 atelier:"https://media.easy-peasy.ai/36f2c4db-d837-48ac-8cdd-8fe6ca0cc9d2/bd290e29-5f40-4a5a-97e1-9c785aa3b64a_thumb.webp"
};
function showDirectory(){
 document.body.innerHTML=`<div class="wrap directory"><span class="badge">50 вайб-демо</span><h1>Персональные прототипы</h1><p class="muted">Внутренняя витрина. Клиенту отправляйте только его персональную ссылку.</p><div class="cards">${CLIENTS.map(c=>`<a class="card" href="?client=${c.slug}"><b>${c.name}</b><small>${c.city} · ${c.niche}</small></a>`).join("")}</div></div>`;
}
function show(c){
 const services=(c.services||"услуги").split(";").map(x=>x.trim()).filter(Boolean);
 const photo=PHOTO[c.type]||PHOTO.beauty;
 document.title=`${c.name} — демо`;
 document.body.innerHTML=`<div class="wrap">
 <div class="top"><span class="badge">Персональный демо-прототип</span><div class="note">Неофициальная концепция. Иллюстративное фото не является фотографией бизнеса. Реальные фото, цены и тексты подставляются после согласования.</div></div>
 <section class="hero"><img src="${photo}" alt="Иллюстративное реалистичное изображение"><div class="hero-copy"><div class="eyebrow">${c.city} · ${c.niche}</div><h1>${c.name}</h1><p>${c.type==="atelier"?"Аккуратная работа, понятные услуги и быстрый способ отправить фото вещи на оценку.":"Красивый современный сайт, который помогает новому клиенту быстро выбрать услугу и перейти к записи."}</p><div class="actions"><a class="btn" href="#demo">Посмотреть сценарий</a><a class="btn alt" href="tel:${c.phone.replace(/[^+0-9]/g,"")}">Позвонить</a></div></div></section>
 <section class="stats"><div class="stat"><b>24/7</b><span>страница доступна клиенту</span></div><div class="stat"><b>1 экран</b><span>понятный первый шаг</span></div><div class="stat"><b>1 заявка</b><span>в структурированном виде</span></div><div class="stat"><b>+ Метрика</b><span>можно измерять рекламу</span></div></section>
 <section id="demo" class="grid"><div class="panel"><div class="eyebrow">Что можно показать</div><h2>Услуги без долгих поисков</h2><div class="services">${services.map(x=>`<span class="chip">${x}</span>`).join("")}</div><div class="flow"><div class="step"><b>1. Клиент выбирает услугу</b><br><span class="muted">Понимает, подходит ли ему предложение.</span></div><div class="step"><b>2. Видит примеры и ориентир</b><br><span class="muted">Реальные фото и прайс добавляются после согласования.</span></div><div class="step"><b>3. Оставляет заявку</b><br><span class="muted">Телефон, мессенджер или онлайн-запись.</span></div></div></div>
 <div class="panel"><div class="eyebrow">Интерактивное демо</div><h2>Быстрая заявка</h2><p class="muted">${c.address}<br>${c.phone}<br>Часы: ${c.hours}</p><div class="field"><label>Что интересует</label><select id="service">${services.map(x=>`<option>${x}</option>`).join("")}</select></div><div class="field"><label>Телефон</label><input placeholder="+7 999 000-00-00"></div><button class="btn" id="send">Отправить заявку</button><div id="out"></div></div></section>
 <div class="footer"><b>${c.name}</b><br>Демонстрационная концепция, не официальный сайт бизнеса.</div></div>`;
 $("#send").onclick=()=>$("#out").innerHTML='<div class="result"><b>Демо: заявка сформирована.</b><br>В рабочей версии она может уходить владельцу в CRM/мессенджер.</div>';
}
const slug=new URLSearchParams(location.search).get("client");
slug?show(CLIENTS.find(x=>x.slug===slug)||CLIENTS[0]):showDirectory();