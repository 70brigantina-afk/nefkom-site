
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const bySlug=s=>CLIENTS.find(x=>x.slug===s);
const money=n=>new Intl.NumberFormat('ru-RU').format(Math.round(n))+' ₽';

const blueprints={
 beauty:{title:'Запись без звонков — клиент выбирает услугу, мастера и время сам',sub:'Демонстрация лендинга с онлайн-записью, подтверждением и мини-панелью администратора.',features:['Онлайн-запись 24/7','Выбор мастера и услуги','Напоминание о визите','Мини-CRM расписания']},
 medical:{title:'Понятный путь от услуги до записи на консультацию',sub:'Демо медицинского лендинга: направления, специалисты, ответы на вопросы и выбор времени.',features:['Запись на консультацию','Выбор направления/врача','FAQ и подготовка к визиту','Подтверждение и напоминание']},
 build:{title:'Клиент считает проект и оставляет уже квалифицированную заявку',sub:'Демо лендинга с квизом/калькулятором и мини-CRM заявок.',features:['Квиз-смета','Сбор параметров проекта','Кейсы и этапы','Мини-CRM заявок']},
 auto:{title:'Стоимость услуги и свободное время — без переписки с администратором',sub:'Демо для автоуслуг: калькулятор пакета + запись на слот.',features:['Калькулятор пакета','Выбор авто/услуги','Онлайн-запись','Напоминание клиенту']},
 school:{title:'Запись на пробное занятие и подбор программы в одном окне',sub:'Демо для школы: выбор курса, уровень, расписание и пробное занятие.',features:['Мини-тест уровня','Расписание групп','Пробный урок','Автонапоминание']},
 legal:{title:'Навигатор по услугам + запись на консультацию',sub:'Клиент выбирает свою ситуацию, получает подходящее направление и бронирует время.',features:['Навигатор проблемы','Подбор услуги','Список документов','Запись на консультацию']},
 event:{title:'Проверка даты + бриф + ориентир бюджета за несколько минут',sub:'Демо для event/wedding-бизнеса: клиент сразу оставляет структурированный запрос.',features:['Проверка даты','Квиз по формату','Ориентир бюджета','Бриф в мини-CRM']}
};

function showDirectory(){
 document.body.innerHTML='<div class="wrap directory"><span class="badge">50 персональных демо</span><h1>Демо-витрина потенциальных клиентов</h1><p class="muted">Внутренняя страница Ирины. Откройте нужный бизнес — клиенту отправляйте только его персональную ссылку.</p><input id="q" class="search" placeholder="Найти бизнес или нишу"><div id="cards" class="cards"></div></div>';
 const draw=(q='')=>{ const list=CLIENTS.filter(c=>(c.name+' '+c.niche+' '+c.city).toLowerCase().includes(q.toLowerCase())); $('#cards').innerHTML=list.map(c=>'<a class="client-card" href="?client='+encodeURIComponent(c.slug)+'"><b>'+c.name+'</b><small>'+c.city+' · '+c.niche+'</small><p>'+blueprints[c.type].features[0]+' + '+blueprints[c.type].features[1]+'</p></a>').join(''); };
 draw(); $('#q').addEventListener('input',e=>draw(e.target.value));
}

function toolHtml(type){
 if(['beauty','medical'].includes(type)) return '<div class="tool"><div class="field"><label>Услуга</label><select id="service"><option>Первичная консультация</option><option>Основная услуга</option><option>Комплексная программа</option></select></div><div class="field"><label>Специалист</label><select><option>Любой доступный</option><option>Специалист 1</option><option>Специалист 2</option></select></div><div class="field"><label>Свободное время</label><div class="slots"><button class="slot">10:00</button><button class="slot">12:30</button><button class="slot">15:00</button><button class="slot">18:30</button></div></div><button class="btn" id="book">Записаться</button><div id="out"></div></div>';
 if(type==='build') return '<div class="tool"><div class="field"><label>Тип проекта</label><select id="project"><option value="1">Базовый проект</option><option value="1.45">Проект + комплектация</option><option value="1.9">Под ключ</option></select></div><div class="field"><label>Площадь / объём</label><input id="area" type="number" value="65" min="10"></div><div class="field"><label>Уровень материалов</label><select id="level"><option value="1">Стандарт</option><option value="1.35">Комфорт</option><option value="1.75">Премиум</option></select></div><button class="btn" id="calc">Получить ориентир</button><div id="out"></div></div>';
 if(type==='auto') return '<div class="tool"><div class="field"><label>Класс автомобиля</label><select id="car"><option value="1">Седан</option><option value="1.2">Кроссовер</option><option value="1.45">Большой SUV</option></select></div><div class="field"><label>Пакет</label><select id="pack"><option value="6000">Уход</option><option value="14000">Глубокий детейлинг</option><option value="28000">Комплекс + защита</option></select></div><button class="btn" id="calc">Рассчитать</button><div id="out"></div></div>';
 if(type==='school') return '<div class="tool"><div class="field"><label>Цель</label><select><option>Разговорный язык</option><option>Экзамены</option><option>Для ребёнка</option><option>Для работы</option></select></div><div class="field"><label>Удобное время</label><select><option>Будни утром</option><option>Будни вечером</option><option>Выходные</option></select></div><div class="field"><label>Пробный урок</label><div class="slots"><button class="slot">Вт 18:00</button><button class="slot">Ср 19:00</button><button class="slot">Сб 12:00</button></div></div><button class="btn" id="book">Записаться на пробный</button><div id="out"></div></div>';
 if(type==='legal') return '<div class="tool"><div class="field"><label>С чем нужна помощь</label><select id="issue"><option>Договор / сделка</option><option>Спор / претензия</option><option>Бизнес / налоги</option><option>Личный вопрос</option></select></div><div class="field"><label>Срочность</label><select><option>Можно планово</option><option>Нужно в ближайшие дни</option><option>Срочно сегодня</option></select></div><button class="btn" id="book">Подобрать формат консультации</button><div id="out"></div></div>';
 return '<div class="tool"><div class="field"><label>Дата мероприятия</label><input id="date" type="date"></div><div class="field"><label>Формат</label><select id="format"><option value="1">Камерное событие</option><option value="1.6">Свадьба / частное событие</option><option value="2.2">Корпоратив / большой event</option></select></div><div class="field"><label>Гостей</label><input id="guests" type="number" value="50" min="10"></div><button class="btn" id="calc">Проверить дату и бюджет</button><div id="out"></div></div>';
}

function bindTool(c){
 $$('.slot').forEach(b=>b.onclick=()=>{$$('.slot').forEach(x=>x.classList.remove('active'));b.classList.add('active')});
 const out=$('#out');
 if($('#book')) $('#book').onclick=()=>{out.innerHTML='<div class="result"><b>Демо: заявка создана</b><br>Клиент получает подтверждение, а администратор видит запись в расписании/CRM.</div>'};
 if($('#calc')) $('#calc').onclick=()=>{
   let sum=0;
   if(c.type==='build') sum=(+$('#area').value||60)*2200*(+$('#project').value)*(+$('#level').value);
   else if(c.type==='auto') sum=(+$('#car').value)*(+$('#pack').value);
   else if(c.type==='event') sum=(+$('#guests').value||50)*1800*(+$('#format').value);
   out.innerHTML='<div class="result"><b>Предварительный ориентир: '+money(sum)+'</b><br>В реальной версии диапазоны и логика настраиваются под прайс бизнеса; заявка сразу попадает менеджеру.</div>';
 };
}

function showClient(c){
 const b=blueprints[c.type], rating=c.rating?c.rating.toFixed(1)+' / 5':'рейтинг уточняется', reviews=c.reviews?c.reviews+' отзывов':'отзывы уточняются';
 document.title=c.name+' — демонстрационный прототип';
 document.body.innerHTML=`
 <div class="wrap"><div class="top"><span class="badge">Персональный демо-прототип</span><div class="demo-note">Неофициальная концепция, подготовленная специально для ${c.name}. Тексты, цены и слоты демонстрационные — финальная версия настраивается по данным бизнеса.</div></div>
 <section class="hero"><div class="eyebrow">${c.city} · ${c.niche}</div><h1>${c.name}</h1><p>${b.title}</p><div class="actions"><a class="btn" href="#demo">Посмотреть, как работает</a><a class="btn alt" href="tel:${(c.phone||'').replace(/[^+0-9]/g,'')}">Контакт бизнеса</a></div></section>
 <section class="stats"><div class="stat"><b>${rating}</b><span>публичный рейтинг</span></div><div class="stat"><b>${reviews}</b><span>социальное доказательство</span></div><div class="stat"><b>24/7</b><span>приём заявок онлайн</span></div><div class="stat"><b>1 окно</b><span>заявки, расписание и контакты</span></div></section>
 <section id="demo" class="grid"><div class="panel"><div class="eyebrow">Что предлагается</div><h2>${b.title}</h2><p class="muted">${b.sub}</p><div class="features">${b.features.map(x=>'<div class="feature"><b>'+x+'</b><span class="muted">Можно адаптировать под реальные процессы бизнеса.</span></div>').join('')}</div><div class="mini-crm"><b>Мини-CRM / панель администратора</b><div class="crm-row"><span>Новая заявка</span><span><span class="pill">Новая</span></span><span>сегодня</span></div><div class="crm-row"><span>Клиент: демо</span><span><span class="pill">Подтверждена</span></span><span>15:00</span></div><div class="crm-row"><span>Напоминание</span><span><span class="pill">Авто</span></span><span>за 2 ч.</span></div></div></div>
 <div class="panel"><div class="eyebrow">Интерактивное демо</div><h2>Попробуйте как клиент</h2><p class="muted">${c.address}. Контакт: ${c.phone||'уточняется'}.</p>${toolHtml(c.type)}</div></section>
 <section class="section"><div class="cases"><div class="case"><h3>Меньше ручной переписки</h3><p>Клиент сам проходит ключевые шаги и оставляет структурированную заявку.</p></div><div class="case"><h3>Понятнее для нового клиента</h3><p>Услуги, сценарий, доверие и следующий шаг собраны в одном месте.</p></div><div class="case"><h3>Можно развивать</h3><p>Подключить аналитику, уведомления, оплату, CRM, календарь, SEO-страницы и рекламу.</p></div></div></section>
 <footer class="footer"><b>${c.name}</b><br>Демонстрационная концепция. Не является официальным сайтом бизнеса и не публикует реальные цены/расписание.</footer></div>`;
 bindTool(c);
}
const p=new URLSearchParams(location.search), slug=p.get('client');
if(slug){const c=bySlug(slug); c?showClient(c):showDirectory()} else showDirectory();
