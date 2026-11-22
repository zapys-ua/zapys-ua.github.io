# Эталон качества: уровень наград

Задача 1.16. Решение Олега 23.11.2026: на награды не подаёмся. Критерии Awwwards, Dribbble и
CSS Design Awards служат эталоном качества для сайта, демо-сайтов и записи. Кадры и видео
используем в продажах (сообщения лидам, Instagram, кейсы). Обновлять кадры: `kit.html` через локальный сервер, команды в шапке файла.

## Что готово

| Файл | Для чего |
|---|---|
| `dribbble-hero.png` | Шот 1600×1200: первый экран с часами и потоком записей |
| `dribbble-sites.png` | Шот: три демо-сайта на телефонах |
| `dribbble-loop.png` | Шот: петля повернення |
| `dribbble-booking.png` | Шот: запись и меню демо-сайта |
| `avenue-10s.mp4` | Видео 10 с, 1600×1200, 30 к/с: часы, квитки, переход к петле |
| `og-preview.png` | Превью ссылки 1200×630, им же заменён `/og.png` сайта |
| `kit.html` | Генератор кадров из живых страниц |

Видео записано без ffmpeg (Chrome, виртуальное время, MediaRecorder). Файл фрагментированный MP4:
браузер узнаёт длительность только при воспроизведении, площадки при загрузке перекодируют.

## Замеры (PageSpeed Insights, телефон, 22.11.2026)

| Страница | Скорость | Доступность | Рекомендации | SEO |
|---|---|---|---|---|
| Главная | 97 | 97 | 100 | 100 |
| Демо-сайт barber | 92 | 100 | 100 | 63 (стоит `noindex`, демо-бизнес не должен попадать в поиск) |

После замера исправлены: контраст квитков в потоке (были полупрозрачные), анимация узлов кольца
через fill и stroke, шрифты через `@import` (теперь `<link>` в каждой странице), ранняя загрузка
фото первого экрана на демо-сайтах. Повторный замер после выкладки.

## Площадки (справочно, подача не планируется)

| Площадка | Что подаём | Цена | Кто |
|---|---|---|---|
| Dribbble | 4 шота и видео как один проект | Бесплатно | Олег создаёт аккаунт, я готовлю тексты |
| CSS Design Awards | Главная | Есть бесплатная и платная подача, проверить на сайте перед отправкой | Олег |
| webdesignawards.io | Главная | Базовая подача бесплатна по описанию, Premium платный; проверить | Олег |
| Awwwards | Главная | Платная подача, решение Олега | Олег |
| Behance | Кейс со всеми кадрами | Бесплатно | Олег |

Свой домен вместо zapys-ua.github.io стоит денег, решение Олега. Жюри Awwwards домен не требует.

## Тексты

**Название:** Avenue: bookings and returning clients for small businesses

**Коротко (EN):** Avenue sets up online booking, a business website and a Telegram bot for barbershops, salons, tyre services and groomers in one day. The site tells that story with a live booking feed whose clock ticks through the night, a "return loop" that counts visits and money, and three demo websites built from the same template.

**Описание (EN, для Awwwards и CSSDA):**
Avenue is a done-for-you booking service for small businesses in Dnipro, Ukraine. The homepage is built around one signature object: the booking ticket. Tickets drop into the owner's feed at 23:40, 06:55, 00:30, while the headline clock follows them: clients book even when the owner sleeps. The return loop shows the product as a cycle (booking, reminder, review, return, gift card) and counts visits and revenue for the chosen industry. Visitors pick their industry with one tap, and the whole page rewrites itself: headline, live phone, prices and calculator. Three demo websites (barbershop, tyre service, grooming salon) share one template and open booking in place, on the exact service the client tapped.
Vanilla JS, no build step, no frameworks, under 100 KB of HTML. Animations use only transform and opacity, pause off-screen and respect reduced motion. Mobile PageSpeed 97 / 97 / 100 / 100.

**Описание (UK, для Behance и соцсетей):**
Avenue налаштовує онлайн-запис, сайт і бот у Telegram для барбершопів, салонів, шиномонтажів і грумінгу за один день. Сайт розповідає це однією деталлю, квитком запису: квитки падають у Пульт власника о 23:40 і 06:55, а годинник у заголовку йде за ними. Петля повернення рахує візити й гроші, а три демо-сайти показують, що бізнес отримає в пакеті «Преміум».

**Теги:** booking, small business, SaaS, Telegram, typography, editorial, ticket, animation, Ukraine, barbershop

**Цвета:** #F5F0E6 (папір), #17140F (чорнило), #B8431A (теракота)

**Шрифты:** Unbounded, Golos Text; на демо-сайтах Playfair Display, Rubik, Nunito

**Технологии:** HTML, CSS, vanilla JavaScript, Supabase Edge Functions, Telegram Bot API, GitHub Pages

**Авторы:** Avenue Studio (Олег), дизайн и код с Claude

## Как пользоваться эталоном

1. Совет недели оценивает главную, демо-сайты и запись по осям Awwwards (журнал в разделе 6
   `docs/plans/2026-11-23-showcase-tz.md`), порог 8 по каждой оси.
2. PageSpeed на телефоне от 90 по скорости и доступности после каждого заметного изменения.
3. Кадры обновляются `kit.html` и `scripts/record-video.mjs`, когда меняется первый экран или демо-сайты.
4. Шоты и видео идут в продажи: первое сообщение лиду, Instagram, кейс на сайте.
