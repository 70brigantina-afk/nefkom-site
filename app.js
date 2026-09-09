const modal = document.querySelector('#modal');
const policy = document.querySelector('#policy');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightboxImage');
const lightboxCaption = document.querySelector('#lightboxCaption');
const galleries = {
  'rabochaya-16': { title: 'Рабочая, 16', count: 4 },
  'shosseynaya-27': { title: 'Шоссейная, 27', count: 6 },
  'shosseynaya-27b': { title: 'Шоссейная, 27Б', count: 6 }
};
let currentGallery = 'rabochaya-16';
let currentIndex = 0;
function showPhoto(index) {
  const gallery = galleries[currentGallery];
  currentIndex = (index + gallery.count) % gallery.count;
  lightboxImage.src = `photos/${currentGallery}/${String(currentIndex + 1).padStart(2, '0')}.webp`;
  lightboxImage.alt = `${gallery.title} — фото ${currentIndex + 1} собственника`;
  lightboxCaption.textContent = `${gallery.title} · ${currentIndex + 1} / ${gallery.count}`;
}
document.querySelectorAll('[data-gallery]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  currentGallery = link.dataset.gallery;
  showPhoto(Number(link.dataset.index));
  lightbox.showModal();
}));
document.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(currentIndex - 1));
document.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(currentIndex + 1));
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    showPhoto(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
let swipeStart = null;
lightboxImage.addEventListener('touchstart', event => {
  swipeStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
lightboxImage.addEventListener('touchend', event => {
  if (!swipeStart || !event.changedTouches.length) return;
  const dx = event.changedTouches[0].clientX - swipeStart.x;
  const dy = event.changedTouches[0].clientY - swipeStart.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) showPhoto(currentIndex + (dx < 0 ? 1 : -1));
  swipeStart = null;
}, { passive: true });
lightboxImage.addEventListener('touchcancel', () => { swipeStart = null; });
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => {
  const request = button.dataset.open;
  const copy = requestCopy(request);
  document.querySelector('#modalTitle').textContent = copy.title;
  document.querySelector('#modalDescription').textContent = copy.description;
  document.querySelector('#modalEyebrow').textContent = copy.eyebrow;
  document.querySelector('#modalObject').textContent = request;
  document.querySelector('#modalSubmit').textContent = copy.cta;
  modal.querySelector('[name=request]').value = request;
  modal.querySelector('[name=_subject]').value = `NEFKOM — ${request}`;
  modal.querySelector('.status').textContent = '';
  modal.showModal();
}));
document.querySelectorAll('dialog .close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
}));
document.querySelectorAll('[data-policy]').forEach(button => button.addEventListener('click', () => policy.showModal()));
document.querySelector('.menu').addEventListener('click', () => document.querySelector('#objects').scrollIntoView());
document.querySelectorAll('[data-address]').forEach(button => button.addEventListener('click', () => {
  const address = button.dataset.address;
  const query = encodeURIComponent(`Нефтекумск, ${address}`);
  const map = document.querySelector('#objectMap');
  map.src = `https://yandex.ru/map-widget/v1/?mode=search&text=${query}`;
  map.title = `Карта: Нефтекумск, ${address}`;
  document.querySelector('#externalMap').href = `https://yandex.ru/maps/?text=${query}`;
  document.querySelectorAll('[data-address]').forEach(item => {
    item.classList.toggle('selected', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
}));
const utm = Object.fromEntries([...new URLSearchParams(location.search)].filter(([key]) => /^utm_/.test(key)));
try { sessionStorage.setItem('utm', JSON.stringify(utm)); } catch { /* Restricted storage must not break the page. */ }
function requestCopy(request) {
  if (/Просмотр/i.test(request)) return {eyebrow:'ЛИЧНЫЙ ПРОСМОТР',title:'Посмотрите объект вживую',description:'Оставьте контакты и удобное время в комментарии — обсудим просмотр выбранного объекта.',cta:'Согласовать просмотр'};
  if (/Планировк/i.test(request)) return {eyebrow:'ПЛАНИРОВКА',title:'Оцените пространство под свой формат',description:'Запросите планировку второго этажа на Рабочей, 16 и уточните, подходит ли пространство вашему бизнесу.',cta:'Получить планировку'};
  if (/Документ/i.test(request)) return {eyebrow:'ДОКУМЕНТЫ ПО ОБЪЕКТУ',title:'Изучите документы до решения',description:'Укажите контакты для обсуждения состава и передачи документов по выбранному объекту.',cta:'Запросить документы'};
  if (/покупк|инвестору/i.test(request)) return {eyebrow:'РАБОЧАЯ, 16 · ПОКУПКА',title:'Получите предложение о покупке здания',description:'Всё здание: 890 м², 2 этажа, 29,9 млн ₽. Отправим характеристики и обсудим условия сделки.',cta:'Получить предложение о покупке'};
  if (/27Б/.test(request)) return {eyebrow:'ШОССЕЙНАЯ, 27Б · АРЕНДА',title:'Территория, склад и навесы под вашу задачу',description:'Расскажите, что нужно разместить или хранить. Обсудим доступную часть территории и стоимость аренды. Занятое отдельное здание исключено.',cta:'Узнать условия территории'};
  if (/Пакет для отдела/i.test(request)) return {eyebrow:'ОТДЕЛУ РАЗВИТИЯ',title:'Получите материалы для рассмотрения',description:'Фотографии, площади и условия по объектам — для оценки вашего коммерческого формата.',cta:'Получить пакет для отдела развития'};
  if (/Презентаци/i.test(request)) return {eyebrow:'ТРИ ОБЪЕКТА · НЕФТЕКУМСК',title:'Выберите объект по фотографиям и цифрам',description:'Отправим фотографии, характеристики и условия. Сравните предложения до поездки в Нефтекумск.',cta:'Получить презентацию'};
  if (/материалов/i.test(request)) return {eyebrow:'СТРОИТЕЛЬНЫЕ МАТЕРИАЛЫ',title:'Запросите перечень и цены остатков',description:'Материалы продаются ниже закупочной цены. Возможна покупка оптом, по группам товаров или частями.',cta:'Получить перечень и цены'};
  if (/оборудован/i.test(request)) return {eyebrow:'ОБОРУДОВАНИЕ',title:'Подберите оборудование для бизнеса',description:'Запросите перечень торгового и складского оборудования, которое продаётся отдельно.',cta:'Получить перечень оборудования'};
  if (/ГАЗОН/i.test(request)) return {eyebrow:'ГРУЗОВОЙ АВТОМОБИЛЬ',title:'Узнайте характеристики ГАЗОН с КМУ',description:'Оставьте контакты для получения информации по автомобилю с краном-манипулятором.',cta:'Получить характеристики автомобиля'};
  if (/Коммуникаци/i.test(request)) return {eyebrow:'ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ',title:'Проверьте объект под свои требования',description:'Укажите необходимые коммуникации и технические требования к помещению.',cta:'Запросить характеристики'};
  if (/27/.test(request)) return {eyebrow:'ШОССЕЙНАЯ, 27 · ТОЛЬКО АРЕНДА',title:'Объедините торговлю и хранение в одной точке',description:'687,8 м² помещения + участок 1595 м². Аренда — от 400 000 ₽/мес. Обсудим объект под ваш бизнес.',cta:'Получить условия аренды'};
  if (/Рабочая/.test(request)) return {eyebrow:'РАБОЧАЯ, 16 · АРЕНДА',title:'Примерьте целый этаж к своему бизнесу',description:'Около 450 м² на втором этаже — 149 000 ₽/мес. Расскажите о вашем формате и получите условия аренды.',cta:'Получить условия аренды этажа'};
  return {eyebrow:'ПОДБОР ОБЪЕКТА',title:'Найдём площадку под задачи бизнеса',description:'Укажите нужный формат, площадь и требования — обсудим подходящее предложение.',cta:'Получить предложение под мой бизнес'};
}
function prepareSubmission(event) {
  const form = event.target;
  for (const key of ['utm_source','utm_medium','utm_campaign']) form.querySelector(`[name=${key}]`).value = utm[key] || '';
  const selection = form.querySelector('[name=object]');
  if (selection) form.querySelector('[name=_subject]').value = `NEFKOM — подбор объекта: ${selection.value}`;
  form.querySelector('.status').textContent = 'Переходим к проверке отправки…';
  // Native HTTPS POST: FormSubmit handles CAPTCHA, recipient activation and delivery.
  // Do not mark a lead as delivered merely because the visitor clicked Submit.
}
document.querySelector('#leadForm').addEventListener('submit', prepareSubmission);
document.querySelector('#modalForm').addEventListener('submit', prepareSubmission);
