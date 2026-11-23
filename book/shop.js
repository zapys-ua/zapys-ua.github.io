// Допродаж на записі: товари під обрану послугу і набори. Поки демонстраційні: для демо-бізнесів
// (config.demo). Справжньому бізнесу каталог приходитиме з config.shop, коли zapys-api навчиться
// зберігати товари і оплату в записі (задача в docs/ROADMAP.md). Ціни демонстраційні.
// art: форма картинки (bottle, jar, drop, tube, spray, comb, box, roller, brush), c: колір.
window.SHOP = {
  discount: 5, // % за оплату онлайн одразу: менше неявок, а еквайринг (1,3–2%) бізнес усе одно платить
  bundle: 10, // % на набір
  barber: {
    items: [
      { id: "clay", name: "Матова глина для укладання", note: "85 г, тримає до вечора", price: 420, art: "jar", c: "#2E2A24", for: ["b_cut", "b_combo", "b_dad"] },
      { id: "shamp", name: "Шампунь для щоденного миття", note: "250 мл, для чоловічої шкіри", price: 360, art: "bottle", c: "#1F4D3A", for: "*" },
      { id: "oil", name: "Олія для бороди", note: "30 мл, кедр і бергамот", price: 390, art: "drop", c: "#8A5A2B", for: ["b_beard", "b_combo"] },
      { id: "balm", name: "Бальзам для бороди", note: "60 мл, без блиску", price: 340, art: "tube", c: "#C9A56B", for: ["b_beard", "b_combo"] },
      { id: "kids", name: "Дитячий шампунь без сліз", note: "200 мл", price: 280, art: "bottle", c: "#5B8DEF", for: ["b_kids", "b_dad"] }
    ],
    sets: [
      { id: "set_cut", name: "Набір під вашу стрижку", note: "Глина і шампунь: укладання вдома як у кріслі", items: ["clay", "shamp"], for: ["b_cut", "b_combo", "b_dad"] },
      { id: "set_beard", name: "Набір для бороди", note: "Олія і бальзам: м'яка борода між візитами", items: ["oil", "balm"], for: ["b_beard", "b_combo"] }
    ]
  },
  sto: {
    items: [
      { id: "store", name: "Зберігання шин до весни", note: "Миття, пакування, склад", price: 900, art: "box", c: "#1E3A5F", for: ["s_tires"] },
      { id: "wash", name: "Незамерзайка −20 °C", note: "4 л, без запаху спирту", price: 220, art: "bottle", c: "#3C8DD9", for: "*" },
      { id: "caps", name: "Ковпачки на ніпелі", note: "4 шт., алюміній", price: 120, art: "comb", c: "#FFC53D", for: ["s_tires", "s_bal"] },
      { id: "oilt", name: "Олива в дорогу", note: "1 л, на доливання", price: 380, art: "bottle", c: "#C4842D", for: ["s_oil"] }
    ],
    sets: [
      { id: "set_winter", name: "Зимовий набір", note: "Незамерзайка і ковпачки: до першого снігу готові", items: ["wash", "caps"], for: ["s_tires", "s_bal"] }
    ]
  },
  groom: {
    items: [
      { id: "gsh", name: "Шампунь під тип шерсті", note: "250 мл, гіпоалергенний", price: 380, art: "bottle", c: "#7A4E1B", for: "*" },
      { id: "spray", name: "Спрей від ковтунів", note: "200 мл, легке розчісування", price: 330, art: "spray", c: "#B9C9A8", for: ["g_full", "g_hyg", "g_bath"] },
      { id: "brush", name: "Пуходерка", note: "Для щоденного вичісування", price: 290, art: "brush", c: "#F4C7A1", for: ["g_full", "g_bath"] },
      { id: "treat", name: "Ласощі без зерна", note: "100 г, нагорода за терпіння", price: 160, art: "box", c: "#E9B949", for: "*" }
    ],
    sets: [
      { id: "set_coat", name: "Догляд між стрижками", note: "Спрей і пуходерка: шерсть без ковтунів до наступного візиту", items: ["spray", "brush"], for: ["g_full", "g_bath"] }
    ]
  },
  nails: {
    items: [
      { id: "cut", name: "Олійка для кутикули", note: "10 мл, мигдаль", price: 180, art: "drop", c: "#C98B8B", for: "*" },
      { id: "cream", name: "Крем для рук", note: "50 мл, вбирається за хвилину", price: 260, art: "tube", c: "#E7C6C0", for: ["n_mani", "n_basic", "n_ext"] },
      { id: "file", name: "Скляна пилочка", note: "Не розшаровує ніготь", price: 150, art: "comb", c: "#B8A1D9", for: ["n_mani", "n_ext", "n_basic"] },
      { id: "foot", name: "Крем для стоп", note: "75 мл, з сечовиною", price: 290, art: "tube", c: "#A8C3B6", for: ["n_pedi"] }
    ],
    sets: [
      { id: "set_care", name: "Догляд між візитами", note: "Олійка і крем: покриття тримається довше", items: ["cut", "cream"], for: ["n_mani", "n_basic", "n_ext"] }
    ]
  },
  massage: {
    items: [
      { id: "moil", name: "Масажна олія з лавандою", note: "100 мл, для самомасажу", price: 340, art: "drop", c: "#7D6BA8", for: "*" },
      { id: "roller", name: "Масажний ролик", note: "Для спини і ніг", price: 450, art: "roller", c: "#2F5D50", for: ["m_back", "m_sport", "m_full"] },
      { id: "warm", name: "Розігрівальний бальзам", note: "50 мл, після тренувань", price: 290, art: "jar", c: "#C0603A", for: ["m_sport", "m_back"] },
      { id: "gua", name: "Скребок гуаша", note: "Натуральний камінь", price: 380, art: "comb", c: "#6FA58C", for: ["m_face"] }
    ],
    sets: [
      { id: "set_home", name: "Відновлення вдома", note: "Ролик і бальзам: ефект масажу тримається довше", items: ["roller", "warm"], for: ["m_back", "m_sport"] }
    ]
  },
  dental: {
    items: [
      { id: "brush", name: "Зубна щітка м'яка", note: "Рекомендує лікар після гігієни", price: 190, art: "brush", c: "#3C8DD9", for: "*" },
      { id: "paste", name: "Паста після відбілювання", note: "75 мл, без пігментів", price: 280, art: "tube", c: "#9CC8E8", for: ["d_white", "d_clean"] },
      { id: "floss", name: "Зубна нитка з воском", note: "50 м", price: 120, art: "box", c: "#7BC4B1", for: ["d_clean", "d_caries", "d_cons"] },
      { id: "irr", name: "Портативний іригатор", note: "3 режими, USB-C", price: 1490, art: "bottle", c: "#E6EEF5", for: ["d_clean", "d_white"] }
    ],
    sets: [
      { id: "set_after", name: "Догляд після гігієни", note: "Щітка, нитка і паста: результат чистки довше", items: ["brush", "floss", "paste"], for: ["d_clean"] }
    ]
  }
};
// Картинка товару: проста векторна форма у кольорі товару, без фото і чужих брендів.
window.SHOP.art = function (kind, c) {
  var o = '<svg viewBox="0 0 64 64" aria-hidden="true">', e = "</svg>", w = "rgba(255,255,255,.55)";
  var s = {
    bottle: '<rect x="26" y="6" width="12" height="8" rx="2" fill="#2B2B2B"/><rect x="18" y="14" width="28" height="44" rx="8" fill="' + c + '"/><rect x="23" y="28" width="18" height="16" rx="3" fill="' + w + '"/>',
    jar: '<rect x="14" y="18" width="36" height="8" rx="3" fill="#2B2B2B"/><rect x="12" y="26" width="40" height="28" rx="8" fill="' + c + '"/><rect x="20" y="34" width="24" height="10" rx="3" fill="' + w + '"/>',
    drop: '<rect x="28" y="4" width="8" height="12" rx="3" fill="#2B2B2B"/><rect x="25" y="15" width="14" height="6" rx="2" fill="#555"/><rect x="20" y="21" width="24" height="37" rx="7" fill="' + c + '"/><rect x="25" y="32" width="14" height="14" rx="3" fill="' + w + '"/>',
    tube: '<path d="M22 8h20l4 40H18z" fill="' + c + '"/><rect x="24" y="48" width="16" height="10" rx="2" fill="#2B2B2B"/><rect x="24" y="18" width="16" height="16" rx="3" fill="' + w + '"/>',
    spray: '<rect x="26" y="4" width="16" height="7" rx="2" fill="#2B2B2B"/><rect x="29" y="11" width="8" height="6" fill="#555"/><rect x="20" y="17" width="26" height="41" rx="9" fill="' + c + '"/><rect x="25" y="30" width="16" height="14" rx="3" fill="' + w + '"/>',
    comb: '<rect x="8" y="22" width="48" height="10" rx="4" fill="' + c + '"/>' + [12, 18, 24, 30, 36, 42, 48].map(function (x) { return '<rect x="' + x + '" y="32" width="3" height="14" rx="1.5" fill="' + c + '"/>'; }).join(""),
    box: '<rect x="12" y="18" width="40" height="38" rx="5" fill="' + c + '"/><path d="M12 28h40" stroke="rgba(0,0,0,.18)" stroke-width="2"/><rect x="24" y="36" width="16" height="10" rx="2" fill="' + w + '"/><path d="M20 18l4-8h16l4 8" fill="' + c + '" opacity=".7"/>',
    roller: '<rect x="8" y="26" width="48" height="12" rx="6" fill="' + c + '"/><rect x="2" y="28" width="8" height="8" rx="3" fill="#2B2B2B"/><rect x="54" y="28" width="8" height="8" rx="3" fill="#2B2B2B"/>' + [16, 24, 32, 40, 48].map(function (x) { return '<rect x="' + x + '" y="26" width="2" height="12" fill="rgba(0,0,0,.15)"/>'; }).join(""),
    brush: '<rect x="29" y="22" width="6" height="36" rx="3" fill="#2B2B2B"/><rect x="18" y="6" width="28" height="18" rx="6" fill="' + c + '"/>' + [22, 27, 32, 37, 42].map(function (x) { return '<rect x="' + (x - 1) + '" y="9" width="2" height="12" rx="1" fill="rgba(0,0,0,.2)"/>'; }).join("")
  };
  return o + (s[kind] || s.box) + e;
};
