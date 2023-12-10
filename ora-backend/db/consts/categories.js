const categories = {
  hair: { name: "Волосы" },
  depilation: { name: "Удаление волос" },
  massage: { name: "Массаж" },
  nails: { name: "Ногти" },
  brows: { name: "Брови" },
  eyelashes: { name: "Ресницы" },
  tatoo: { name: "Тату" },
  face: { name: "Лицо" },
  man: { name: "Мужское" },
  peeling: { name: "Пилинг" },
};

const procedures = [
  {
    name: "Бритье",
    categories: [categories.depilation, categories.man, categories.face],
  },
  {
    name: "Восковая депиляция  ",
    categories: [categories.depilation, categories.face, categories.man],
  },
  {
    name: "Эпиляция сахаром (шугаринг)",
    categories: [categories.depilation, categories.face],
  },
  {
    name: "Электроэпиляция ",
    categories: [categories.depilation, categories.face],
  },
  {
    name: "Лазерная эпиляция ",
    categories: [categories.depilation, categories.man],
  },
  {
    name: "Интенсивный световой пульсовой метод",
    categories: [categories.depilation],
  },
  {
    name: "Депиляция с использованием химических средст",
    categories: [categories.depilation],
  },
  {
    name: "Механическое удаления волос (пинцет, тридэ, эпилятор)",
    categories: [categories.depilation, categories.face, categories.man],
  },
  {
    name: "Электролиз",
    categories: [categories.depilation, categories.man],
  },
  {
    name: "Удаление волос лазером над верхней губой",
    categories: [categories.depilation, categories.face, categories.man],
  },
  {
    name: "Депиляция воском для лица",
    categories: [categories.depilation, categories.face, categories.man],
  },
  {
    name: "Депиляция воском для бикини",
    categories: [categories.depilation],
  },
  { name: "Депиляция воском для ног", categories: [categories.depilation] },
  {
    name: "Удаление волос на руках и ногах с помощью эпилятора",
    categories: [categories.depilation],
  },
  {
    name: "Депиляция пяток и стоп",
    categories: [categories.depilation, categories.man],
  },
  {
    name: " Депиляция воском для подмышек",
    categories: [categories.depilation, categories.man],
  },
  {
    name: "Депиляция с использованием нити (тридэ)",
    categories: [categories.depilation, categories.face],
  },
  {
    name: "  Удаление волос на груди",
    categories: [categories.depilation, categories.man],
  },
  {
    name: "Депиляция воском для спины",
    categories: [categories.depilation, categories.man],
  },
  {
    name: "  Удаление волос на бровях",
    categories: [categories.depilation, categories.face],
  },
  {
    name: "Депиляция ног методом холодной восковой ленты",
    categories: [categories.depilation],
  },
  {
    name: "Удаление волос на животе",
    categories: [categories.depilation, categories.man],
  },
  { name: "Депиляция воском для рук", categories: [categories.depilation] },
  {
    name: "  Удаление волос на бедрах",
    categories: [categories.depilation],
  },
  {
    name: "Депиляция интимных зон (бразилиан)",
    categories: [categories.depilation],
  },
  {
    name: "Удаление волос на ногах с помощью электролиза",
    categories: [categories.depilation],
  },
  {
    name: "Депиляция усов",
    categories: [categories.depilation, categories.face, categories.man],
  },
  {
    name: "Удаление волос на пальцах ног и рук",
    categories: [categories.depilation],
  },
  {
    name: "Депиляция с использованием кремов или гелей",
    categories: [categories.depilation],
  },
  {
    name: "Удаление волос на плечах и спине с использованием лазера",
    categories: [categories.depilation, categories.man],
  },
  {
    name: "Депиляция подмышек с использованием электроэпилятора",
    categories: [categories.depilation, categories.man],
  },
  {
    name: "Удаление волос на шее",
    categories: [categories.depilation, categories.man],
  },
  {
    name: "Интимная депиляция (бикини-зона)",
    categories: [categories.depilation],
  },
  {
    name: "Удаление волос на руках с использованием восковых полос",
    categories: [categories.depilation],
  },
  {
    name: "Депиляция груди и живота с использованием горячего воска",
    categories: [categories.depilation, categories.man],
  },
  {
    name: " Удаление волос на бедрах с использованием сахарной пасты",
    categories: [categories.depilation],
  },
  {
    name: "Депиляция волос на лице с использованием темного воска",
    categories: [categories.depilation, categories.face],
  },
  {
    name: "Удаление волос на ногах с помощью кремовых средств",
    categories: [categories.depilation],
  },
  {
    name: "Депиляция волос на бровях с использованием нити",
    categories: [categories.depilation, categories.face, categories.man],
  },
  {
    name: " Удаление волос с помощью депиляторных кремов",
    categories: [categories.depilation],
  },
  {
    name: "Депиляция интимных зон (французская эпиляция)",
    categories: [categories.depilation],
  },
  {
    name: "Депиляция волос на плечах с использованием шугаринга",
    categories: [categories.depilation],
  },
  {
    name: "  Удаление волос на животе с использованием лазера",
    categories: [categories.depilation],
  },
  {
    name: "Депиляция подмышек с использованием холодного воска",
    categories: [categories.depilation, categories.man],
  },
  { name: " Маникюр", categories: [categories.nails, categories.man] },
  { name: "Педикюр", categories: [categories.nails, categories.man] },
  { name: "Наращивание ногтей", categories: [categories.nails] },
  { name: "Гель-лак", categories: [categories.nails] },
  { name: "Маникюр с покрытием шеллаком", categories: [categories.nails] },
  { name: "Френч-маникюр", categories: [categories.nails] },
  {
    name: "Наращивание ногтей гель-пластинами",
    categories: [categories.nails],
  },
  { name: "Украшение ногтей", categories: [categories.nails] },
  {
    name: "Аппаратный педикюр",
    categories: [categories.nails, categories.man],
  },
  {
    name: "Маникюр для мужчин",
    categories: [categories.nails, categories.man],
  },
  {
    name: "Гидромассаж стоп",
    categories: [categories.nails, categories.massage, categories.man],
  },
  {
    name: "Укрепление ногтей",
    categories: [categories.nails, categories.man],
  },
  {
    name: "Уход за кутикулой",
    categories: [categories.nails, categories.man],
  },
  { name: 'Маникюр с эффектом "омбре"', categories: [categories.nails] },
  { name: "Акриловое наращивание ногтей", categories: [categories.nails] },
  { name: "Педикюр с обертыванием", categories: [categories.nails] },
  { name: "Гель-полищикур", categories: [categories.nails] },
  {
    name: "Спа-уход для рук и ногтей",
    categories: [categories.nails, categories.man],
  },
  {
    name: 'Маникюр с использованием эффекта "коттедж"',
    categories: [categories.nails],
  },
  {
    name: "Педикюр с покрытием гель-лаком",
    categories: [categories.nails],
  },
  {
    name: "Наращивание ногтей порошковым методом (дип-порошок)",
    categories: [categories.nails],
  },
  {
    name: "Педикюр с парафиновой процедурой",
    categories: [categories.nails],
  },
  { name: "Декоративная роспись ногтей", categories: [categories.nails] },
  { name: "Укрепление ногтей биогелем", categories: [categories.nails] },
  { name: "Художественная роспись ногтей", categories: [categories.nails] },
  { name: 'Маникюр "кэт-аугментация"', categories: [categories.nails] },
  { name: 'Педикюр "коллагеновая маска"', categories: [categories.nails] },
  { name: "Гель-лак с эффектом хрома", categories: [categories.nails] },
  { name: 'Педикюр "френч" стиль', categories: [categories.nails] },
  { name: "Аквариумный маникюр", categories: [categories.nails] },
  { name: "Детский маникюр", categories: [categories.nails] },
  {
    name: "Маникюр с использованием горячего воска",
    categories: [categories.nails],
  },
  {
    name: "Укрепление ногтей жидким стеклом",
    categories: [categories.nails],
  },
  {
    name: "Наращивание ногтей фиброглассом",
    categories: [categories.nails],
  },
  {
    name: 'Шеллак с дизайном "кэт-аугментация"',
    categories: [categories.nails],
  },
  { name: "Градиентный маникюр", categories: [categories.nails] },
  {
    name: "Экзотический маникюр (например, маникюр с мраморным эффектом)",
    categories: [categories.nails],
  },
  {
    name: "Украшение ногтей стразами и пайетками",
    categories: [categories.nails],
  },
  {
    name: "Маникюр с использованием водных наклеек",
    categories: [categories.nails],
  },
  {
    name: "Наращивание ногтей методом скульптурного моделирования",
    categories: [categories.nails],
  },
  {
    name: "Маникюр с использованием техники градиента",
    categories: [categories.nails],
  },
  {
    name: "Маникюр с использованием негативного пространства",
    categories: [categories.nails],
  },
  { name: "Удаление акриловых ногтей", categories: [categories.nails] },
  {
    name: 'Маникюр с дизайном в стиле "мрамор"',
    categories: [categories.nails],
  },
  {
    name: "Уход за ногтями с применением органических продуктов",
    categories: [categories.nails],
  },
  { name: 'Маникюр в стиле "ретро"', categories: [categories.nails] },
  {
    name: "Уход за ногтями во время беременности",
    categories: [categories.nails],
  },
  {
    name: 'Шеллак с дизайном "мраморная вода"',
    categories: [categories.nails],
  },
  {
    name: "Маникюр с использованием страз и рисунков",
    categories: [categories.nails],
  },
  {
    name: "Уход за ногтями при вросших ногтях",
    categories: [categories.nails, categories.man],
  },
  {
    name: 'Шеллак с эффектом "катафореза"',
    categories: [categories.nails],
  },
  { name: "Маникюр с аэрографией", categories: [categories.nails] },
  {
    name: "Классический массаж",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Релаксационный массаж",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Спортивный массаж",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Шведский массаж",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Тайский массаж",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Глубокий тканевой массаж",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж камнями",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж головы",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж шеи и плеч",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж спины",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж ног",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж лица",
    categories: [categories.massage, categories.man, categories.face],
  },
  {
    name: "Массаж живота",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Рефлексология",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Аюрведический массаж",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Лимфодренажный массаж",
    categories: [categories.massage, categories.man],
  },
  { name: "Массаж для беременных", categories: [categories.massage] },
  { name: "Массаж для детей", categories: [categories.massage] },
  {
    name: "Шоколадный массаж",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Антицеллюлитный массаж",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж спортивных травм",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для снятия стресса",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Терапевтический массаж",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж при головной боли",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж при артрите",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж при остеохондрозе",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж при нарушении осанки",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для улучшения сна",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для облегчения болей в спине",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для улучшения циркуляции",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж при нарушениях в работе желудка",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для укрепления иммунитета",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для стимуляции метаболизма",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для улучшения физической подготовки",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж при гематомах и синяках",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж при растяжениях и связочных повреждениях",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для снятия мышечных спазмов",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж при синдроме хронической усталости",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для улучшения психоэмоционального состояния",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для укрепления сердечно-сосудистой системы",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для лечения хронических болей",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж при аллергиях",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для расслабления и стрессораспределения",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж с применением ароматерапии",
    categories: [categories.massage, categories.man],
  },
  {
    name: "Массаж для стимуляции скул",
    categories: [categories.massage, categories.man],
  },
  { name: "Наращивание ресниц", categories: [categories.eyelashes] },
  { name: "Ламинирование ресниц", categories: [categories.eyelashes] },
  { name: "Окрашивание ресниц", categories: [categories.eyelashes] },
  { name: "Экстенсия ресниц", categories: [categories.eyelashes] },
  { name: "Чистка ресниц", categories: [categories.eyelashes] },
  { name: "Укладка ресниц", categories: [categories.eyelashes] },
  { name: "Биозавивка ресниц", categories: [categories.eyelashes] },
  { name: "Восстановление ресниц", categories: [categories.eyelashes] },
  { name: "Уход за ресницами", categories: [categories.eyelashes] },
  { name: "Снятие нарощенных ресниц", categories: [categories.eyelashes] },
  { name: "Коррекция ресниц", categories: [categories.eyelashes] },
  { name: "Ресничный ботокс", categories: [categories.eyelashes] },
  { name: "Маникюр ресниц", categories: [categories.eyelashes] },
  { name: "Удлинение ресниц", categories: [categories.eyelashes] },
  {
    name: "Декоративная раскраска ресниц",
    categories: [categories.eyelashes],
  },
  {
    name: 'Укладка ресниц с эффектом "кэт-аугментация"',
    categories: [categories.eyelashes],
  },
  { name: "Ресничный массаж", categories: [categories.eyelashes] },
  {
    name: "Укладка ресниц с использованием ароматерапии",
    categories: [categories.eyelashes],
  },
  { name: "Ресничный татуаж", categories: [categories.eyelashes] },
  {
    name: "Ресничный аппаратный массаж",
    categories: [categories.eyelashes],
  },
  {
    name: "Ресничное витаминное питание",
    categories: [categories.eyelashes],
  },
  { name: "Ресничный детокс", categories: [categories.eyelashes] },
  { name: "Ресничная глифология", categories: [categories.eyelashes] },
  { name: "Ресничный аромамассаж", categories: [categories.eyelashes] },
  {
    name: "Ресничный аюрведический уход",
    categories: [categories.eyelashes],
  },
  {
    name: "Укладка ресниц с использованием горячего воска",
    categories: [categories.eyelashes],
  },
  {
    name: "Ресничная химическая завивка",
    categories: [categories.eyelashes],
  },
  {
    name: "Татуировка",
    categories: [categories.tatoo, categories.face, categories.man],
  },
  {
    name: "Перманентный макияж",
    categories: [categories.tatoo, categories.face, categories.man],
  },
  {
    name: "Косметический татуаж",
    categories: [categories.tatoo, categories.face, categories.man],
  },
  {
    name: "Сведение татуировки (тату-кавер)",
    categories: [categories.tatoo, categories.face, categories.man],
  },
  {
    name: "Реставрация татуировки",
    categories: [categories.tatoo, categories.face, categories.man],
  },
  {
    name: "Коррекция и модификация татуировки",
    categories: [categories.tatoo, categories.face, categories.man],
  },
  {
    name: "Удаление татуировки (лазерное, хирургическое)",
    categories: [categories.tatoo, categories.face, categories.man],
  },
  {
    name: "Поэтическая татуировка",
    categories: [categories.tatoo, categories.man],
  },
  {
    name: "Религиозная татуировка",
    categories: [categories.tatoo, categories.man],
  },
  {
    name: 'Татуировка в стиле "черно-белая"',
    categories: [categories.tatoo, categories.man],
  },
  {
    name: 'Татуировка в стиле "цветная"',
    categories: [categories.tatoo, categories.man],
  },
  {
    name: 'Татуировка в стиле "граффити"',
    categories: [categories.tatoo, categories.man],
  },
  {
    name: 'Татуировка в стиле "реализм"',
    categories: [categories.tatoo, categories.man],
  },
  {
    name: 'Татуировка в стиле "традиционная"',
    categories: [categories.tatoo, categories.man],
  },
  {
    name: 'Татуировка в стиле "абст',
    categories: [categories.tatoo, categories.man],
  },
  { name: "ПИЛИНГ", categories: [categories.face, categories.peeling] },
  {
    name: "Химический пилинг",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Фруктовый пилинг",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Механический пилинг",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Ультразвуковой пилинг",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Микродермабразия",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Лазерный пилинг",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Энзимный пилинг",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Кислородный пилинг",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Пилинг с гликолевой кислотой",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Пилинг с салициловой кислотой",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Пилинг с молочной кислотой",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Криотерапевтический пилинг",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "ТСА-пилинг (трихлоруксусная кислота)",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Пилинг для чувствительной кожи",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Пилинг для улучшения текстуры кожи",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Пилинг для уменьшения пигментации",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Пилинг для устранения морщин",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Пилинг для контроля жирности кожи",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Пилинг для уменьшения пор",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Пилинг для увлажнения кожи",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Детский пилинг (для подростков)",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Долгосрочный пилинг",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Экспресс-пилинг",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Профессиональный пилинг",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Уход за кожей после пилинга",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Классический массаж лица",
    categories: [categories.face, categories.massage, categories.man],
  },
  {
    name: "Анти-эйдж массаж",
    categories: [categories.face, categories.massage],
  },
  { name: "Парафинотерапия лица", categories: [categories.face] },
  { name: "Уход за кожей лица", categories: [categories.face] },
  {
    name: "Пилинг лица",
    categories: [categories.face, categories.peeling],
  },
  {
    name: "Гликолевый пилинг",
    categories: [categories.face, categories.peeling],
  },
  { name: "Фотоомоложение", categories: [categories.face] },
  { name: "Лазерная омоложение", categories: [categories.face] },
  { name: "Ультразвуковая чистка лица", categories: [categories.face] },
  { name: "Микродермабразия", categories: [categories.face] },
  { name: "Лимфодренаж лица", categories: [categories.face] },
  { name: "Электропорация", categories: [categories.face] },
  { name: "Дарсонвализация", categories: [categories.face] },
  { name: "Рефлексология лица", categories: [categories.face] },
  { name: "Ароматерапия лица", categories: [categories.face] },
  {
    name: "Ботокс и инъекции дермальных наполнителей",
    categories: [categories.face],
  },
  { name: "Ресничное наращивание", categories: [categories.face] },
  {
    name: "Перманентный макияж",
    categories: [categories.face, categories.tatoo],
  },
  {
    name: "Косметический татуаж",
    categories: [categories.face, categories.tatoo],
  },
  {
    name: "Татуировка бровей",
    categories: [categories.face, categories.tatoo],
  },
  {
    name: "Ламинирование бровей и ресниц",
    categories: [categories.face, categories.eyelashes],
  },
  {
    name: "Окрашивание бровей и ресниц",
    categories: [categories.face, categories.eyelashes],
  },
  {
    name: "Уход за бородой и усами",
    categories: [categories.face, categories.man, categories.depilation],
  },
  {
    name: "Чистка кожи лица",
    categories: [categories.face, categories.peeling],
  },
  { name: "Уход за кожей после солнца", categories: [categories.face] },
  { name: "Уход за чувствительной кожей", categories: [categories.face] },
  { name: "Уход за комбинированной кожей", categories: [categories.face] },
  { name: "Уход за проблемной кожей", categories: [categories.face] },
  { name: "Гидрофейс", categories: [categories.face] },
  { name: "Кислородные процедуры для лица", categories: [categories.face] },
  { name: "Маски для лица", categories: [categories.face] },
  { name: "Уход за зоной вокруг глаз", categories: [categories.face] },
  { name: "Уход за губами", categories: [categories.face] },
  { name: "Детский уход за кожей", categories: [categories.face] },
  { name: "Антивозрастные процедуры", categories: [categories.face] },
  { name: "Био-ламинирование кожи лица", categories: [categories.face] },
  { name: "Уход за кожей шеи", categories: [categories.face] },
  { name: "Холодные маски для лица", categories: [categories.face] },
  { name: "Энзимные процедуры для лица", categories: [categories.face] },
  {
    name: "Мужская стрижка",
    categories: [categories.man, categories.hair],
  },
  {
    name: "Бритье головы",
    categories: [categories.man, categories.depilation, categories.hair],
  },
  {
    name: "Бритье бороды",
    categories: [categories.man, categories.depilation],
  },
  {
    name: "Горячее бритье",
    categories: [categories.man, categories.depilation],
  },
  {
    name: "Стрижка бороды",
    categories: [categories.man, categories.depilation],
  },
  {
    name: "Стрижка усов",
    categories: [categories.man, categories.depilation],
  },
  {
    name: "Стрижка бакенбардов",
    categories: [categories.man, categories.depilation],
  },
  {
    name: "Детская стрижка",
    categories: [categories.man, categories.hair],
  },
  {
    name: "Стрижка под машинку",
    categories: [categories.man, categories.hair],
  },
  {
    name: "Стрижка классическая",
    categories: [categories.man, categories.hair],
  },
  {
    name: "Стрижка модельная",
    categories: [categories.man, categories.hair],
  },
  {
    name: "Стрижка боксерская",
    categories: [categories.man, categories.hair],
  },
  {
    name: 'Стрижка "под ноль"',
    categories: [categories.man, categories.hair],
  },
  {
    name: "Укладка волос",
    categories: [categories.man, categories.hair],
  },
  {
    name: "Окрашивание волос",
    categories: [categories.man, categories.hair],
  },
  {
    name: "Стрижка бороды и бакенбардов под машинку",
    categories: [categories.man, categories.depilation],
  },
  {
    name: "Уход за бородой",
    categories: [categories.man, categories.face],
  },
  { name: "Горячее масло для бороды", categories: [categories.man] },
  { name: "Горячее полотенце для бороды", categories: [categories.man] },
  {
    name: "Бритье затылка",
    categories: [categories.man, categories.depilation, categories.hair],
  },
  { name: "Коррекция бровей", categories: [categories.man] },
  {
    name: "Уход за волосами",
    categories: [categories.man, categories.hair],
  },
  { name: "Маникюр", categories: [categories.man, categories.nails] },
  { name: "Педикюр", categories: [categories.man, categories.nails] },
  {
    name: "Массаж головы",
    categories: [categories.man, categories.massage],
  },
  {
    name: "Уход за кожей лица",
    categories: [categories.man, categories.face, categories.peeling],
  },
  { name: "Укладка усов", categories: [categories.man] },
  {
    name: "Татуировка бровей",
    categories: [categories.man, categories.tatoo],
  },
  {
    name: "Укладка волос с использованием косметики",
    categories: [categories.man, categories.hair],
  },
  { name: "Укладка бороды", categories: [categories.man] },
  {
    name: "Татуировка бороды",
    categories: [categories.man, categories.tatoo],
  },
  {
    name: "Татуировка темпорари",
    categories: [categories.man, categories.tatoo],
  },
  {
    name: "Коррекция висков",
    categories: [categories.man, categories.hair],
  },
  {
    name: "Коррекция носа",
    categories: [categories.man, categories.face],
  },
  { name: "Коррекция шеи", categories: [categories.man] },
  {
    name: "Уход за ресницами",
    categories: [categories.man, categories.eyelashes],
  },
  {
    name: "Окрашивание волос",
    categories: [categories.hair, categories.man],
  },
  { name: "Airtouch (длинные волосы)", categories: [categories.hair] },
  { name: "Airtouch (короткие волосы)", categories: [categories.hair] },
  { name: "Airtouch (средняя длина)", categories: [categories.hair] },
  { name: "Airtouch коммерческой зоны", categories: [categories.hair] },
  {
    name: "Консультация по окрашиванию/ уходу",
    categories: [categories.hair],
  },
  { name: "Окрашивание корней", categories: [categories.hair] },
  {
    name: "Окрашивание/тонирование (короткие волосы)",
    categories: [categories.hair],
  },
  {
    name: "Окрашивание/тонирование (длинные волосы)",
    categories: [categories.hair],
  },
  {
    name: "Окрашивание/тонирование (средняя длина)",
    categories: [categories.hair],
  },
  { name: "Тотал блонд", categories: [categories.hair] },
  { name: "Шатуш", categories: [categories.hair] },
  { name: "Балаяж", categories: [categories.hair] },
  { name: "Мелирование", categories: [categories.hair] },
  { name: "Обратный airtouch", categories: [categories.hair] },
  { name: "Смена цвета", categories: [categories.hair] },
  { name: "Контуринг/тонировка", categories: [categories.hair] },
  {
    name: "Парикмахерские услуги",
    categories: [categories.hair, categories.depilation],
  },
  {
    name: "Стрижка с укладкой женская (короткие)",
    categories: [categories.hair, categories.depilation],
  },
  {
    name: "Стрижка с укладкой женская (средняя длина)",
    categories: [categories.hair, categories.depilation],
  },
  {
    name: "Стрижка с укладкой женская (длинные)",
    categories: [categories.hair, categories.depilation],
  },
  {
    name: "Стрижка с укладкой женская (очень длинные)",
    categories: [categories.hair, categories.depilation],
  },
  { name: "Стрижка Каре", categories: [categories.hair] },
  {
    name: "Ровный срез машинкой",
    categories: [categories.hair, categories.man],
  },
  {
    name: "Стрижка мужская",
    categories: [categories.hair, categories.man],
  },
  {
    name: "Стрижка челки",
    categories: [categories.hair, categories.man],
  },
  {
    name: "Стрижка детская",
    categories: [categories.hair, categories.depilation],
  },
  { name: "Укладки", categories: [categories.hair, categories.man] },
  {
    name: "Брашинг или экспресс локоны   Локоны",
    categories: [categories.hair],
  },
  { name: "Укладка на короткие волосы", categories: [categories.hair] },
  {
    name: "Укладка на волосы средней длины",
    categories: [categories.hair],
  },
  { name: "Укладка на длинные волосы", categories: [categories.hair] },
  {
    name: "Укладка на очень длинные волосы",
    categories: [categories.hair],
  },
  { name: "Прическа на средние волосы", categories: [categories.hair] },
  { name: "Прическа на длинные волосы", categories: [categories.hair] },
  { name: "Афрокудри", categories: [categories.hair, categories.man] },
  { name: "Голливудская волна", categories: [categories.hair] },
  { name: "Восстановление волос", categories: [categories.hair] },
  { name: "Уход Tokio Inkarami на длинные", categories: [categories.hair] },
  { name: "волосы", categories: [categories.hair] },
  {
    name: "ПУ Tokio Inkarami на короткие/ средней длины волосы",
    categories: [categories.hair],
  },
  {
    name: "ПУ Tokio Inkarami на очень длинные волосы",
    categories: [categories.hair],
  },
  { name: 'Уход "Kevin Murphy"', categories: [categories.hair] },
  { name: "Уход Davines", categories: [categories.hair] },
  { name: "Уход Olaplex", categories: [categories.hair] },
  {
    name: "Абсолютное счастье на среднюю длину",
    categories: [categories.hair],
  },
  {
    name: "Абсолютное счастье на очень длинные",
    categories: [categories.hair],
  },
  { name: "ПУ NASHI ARGAN FILLER THERAPY", categories: [categories.hair] },
  {
    name: "Уход NASHI ARGAN FILLER SERVICE",
    categories: [categories.hair],
  },
  { name: "K18 восстановление волос", categories: [categories.hair] },
  {
    name: "Ампульное восстановление для роста волос+пилинг кожи головы",
    categories: [categories.hair, categories.peeling],
  },
  {
    name: "Ампульный уход Treat.me oT Kevin",
    categories: [categories.hair],
  },
  { name: "Murphy", categories: [categories.hair] },
  {
    name: "K18 молекулярное восстановление",
    categories: [categories.hair],
  },
  { name: "Реконструкция ] Beverly", categories: [categories.hair] },
  { name: "Hills(длинные волосы)", categories: [categories.hair] },
  {
    name: "Реконструкция ] Beverly Hills(на",
    categories: [categories.hair],
  },
  { name: "короткие волосы)", categories: [categories.hair] },
  { name: "Реконструкция ] Beverly", categories: [categories.hair] },
  { name: "Hills(средняя длина)", categories: [categories.hair] },
  {
    name: "Пилинг для кожи головы",
    categories: [categories.hair, categories.peeling],
  },
  { name: "Кудрявый метод", categories: [categories.hair] },
  { name: "Наращивание волос", categories: [categories.hair] },
  { name: "Консультация", categories: [categories.hair] },
  { name: "Капсульное наращивание волос", categories: [categories.hair] },
  { name: "Загущение волос", categories: [categories.hair] },
  { name: "Снятие наращенных волос", categories: [categories.hair] },
  { name: "Коррекция височной зоны", categories: [categories.hair] },
  { name: "Капсульная коррекция волос", categories: [categories.hair] },
  { name: "Наращивание височных зон", categories: [categories.hair] },
  { name: "Процедуры доп", categories: [categories.hair] },
  { name: "Кератиновое выпрямление волос", categories: [categories.hair] },
  { name: "Ботокс волос", categories: [categories.hair] },
  { name: "Нанопластика", categories: [categories.hair] },
  { name: "Холодное восстановление", categories: [categories.hair] },
  {
    name: "Коррекция и моделирование бровей",
    categories: [categories.brows, categories.face, categories.depilation],
  },
  {
    name: "Окрашивание бровей",
    categories: [categories.brows, categories.face, categories.man],
  },
  {
    name: "Ламинирование бровей",
    categories: [categories.brows, categories.face],
  },
  {
    name: "Ботокс для бровей",
    categories: [categories.brows, categories.face],
  },
  {
    name: "Микроблейдинг",
    categories: [categories.brows, categories.face],
  },
  {
    name: "Татуаж бровей",
    categories: [categories.brows, categories.tatoo],
  },
  { name: "Окрашивание краской ", categories: [categories.brows] },
  { name: "Окрашивание хной", categories: [categories.brows] },
  {
    name: "Корреция нитью",
    categories: [categories.brows, categories.depilation],
  },
  {
    name: "Коррекция пинцетом ",
    categories: [categories.brows, categories.depilation],
  },
  {
    name: "Коррекция воском",
    categories: [categories.brows, categories.depilation],
  },
];

module.exports = {
  categories,
  procedures,
};
