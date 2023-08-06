const categories = {
  hair: { name: "Волосы" },
  depilation: { name: "Удаление Волос" },
  massage: { name: "Массаж" },
  nails: { name: "Ногти" },
  brows: { name: "Брови" },
  eyelashes: { name: "Ресницы" },
  face: { name: "Лицо" },
  body: { name: "Тело" },
  man: { name: "Мужское" },
};

const procedures = [
  {
    name: "Женские стрижки",
    categories: [categories.hair],
  },
  {
    name: "Мужские стрижки",
    categories: [categories.hair, categories.man],
  },
  {
    name: "Химическая завивка для волос",
    categories: [categories.hair, categories.man],
  },
  {
    name: "Женская окраска волос",
    categories: [categories.hair],
  },
  {
    name: "Мужская окраска волос",
    categories: [categories.hair, categories.man],
  },
  {
    name: "Укладка",
    categories: [categories.hair],
  },
  {
    name: "Кератин и ботокс волос",
    categories: [categories.hair],
  },
  {
    name: "Балаяж и омбре",
    categories: [categories.hair],
  },
  {
    name: "Женская депиляция",
    categories: [categories.depilation],
  },
  {
    name: "Мужская депиляция",
    categories: [categories.depilation, categories.man],
  },
  {
    name: "Лазерная депиляция",
    categories: [categories.depilation],
  },
  {
    name: "Депиляция воском",
    categories: [categories.depilation],
  },
  {
    name: "Лечебный массаж",
    categories: [categories.massage],
  },
  {
    name: "Тайский массаж",
    categories: [categories.massage],
  },
  {
    name: "Расслабляющий массаж",
    categories: [categories.massage],
  },
  {
    name: "Мануальная терапия",
    categories: [categories.massage],
  },
  {
    name: "Массаж горячими камнями",
    categories: [categories.massage],
  },
  {
    name: "Антицеллюлитный массаж",
    categories: [categories.massage],
  },
  {
    name: "Точечный массаж",
    categories: [categories.massage],
  },
  {
    name: "Педикюр",
    categories: [categories.nails],
  },
  {
    name: "Маникюр",
    categories: [categories.nails],
  },
  {
    name: "Наращивание ногтей",
    categories: [categories.nails],
  },
  {
    name: "Удаление ногтей или покрытия",
    categories: [categories.nails],
  },
  {
    name: "Акрил, твердый гель или покрытие ногтей",
    categories: [categories.nails],
  },
  {
    name: "Коррекция бровей",
    categories: [categories.brows],
  },
  {
    name: "Окрашивание бровей краской и хной",
    categories: [categories.brows],
  },
  {
    name: "Татуаж бровей",
    categories: [categories.brows],
  },
  {
    name: "Долговременная укладка бровей",
    categories: [categories.brows],
  },
  {
    name: "Просмотреть все виды услуг для бровей",
    categories: [categories.brows],
  },
  {
    name: "Наращивание ресниц",
    categories: [categories.eyelashes],
  },
  {
    name: "Ламинирование ресниц",
    categories: [categories.eyelashes],
  },
  {
    name: "Коррекция нарощенных ресниц",
    categories: [categories.eyelashes],
  },
  {
    name: "Снятие",
    categories: [categories.eyelashes],
  },
  {
    name: "Макияж",
    categories: [categories.face],
  },
  {
    name: "Татуаж",
    categories: [categories.face],
  },
  {
    name: "Пилинг лица",
    categories: [categories.face],
  },
  {
    name: "Массаж лица",
    categories: [categories.face],
  },
  {
    name: "Аппаратная терапия для лица",
    categories: [categories.face],
  },
  {
    name: "Инъекция для лица",
    categories: [categories.face],
  },
  {
    name: "Чистка кожи лица",
    categories: [categories.face],
  },
  {
    name: "Солярий и спрей-загар",
    categories: [categories.body],
  },
  {
    name: "Обертывание тела",
    categories: [categories.body],
  },
  {
    name: "Тату",
    categories: [categories.body],
  },
  {
    name: "Криолиполиз",
    categories: [categories.body],
  },
  {
    name: "Лазерная шлифовка кожи",
    categories: [categories.body],
  },
  {
    name: "Коррекция бороды и окрашивание",
    categories: [categories.man],
  },
];

module.exports = {
  categories,
  procedures,
};
