const cities = [
  { name: "Барановичи", priority: 0 },
  { name: "Барань", priority: 0 },
  { name: "Белоозерск", priority: 0 },
  { name: "Белыничи", priority: 0 },
  { name: "Берёза", priority: 0 },
  { name: "Березино", priority: 0 },
  { name: "Березовка", priority: 0 },
  { name: "Бобруйск", priority: 0 },
  { name: "Борисов", priority: 0 },
  { name: "Браслав", priority: 0 },
  { name: "Брест", priority: 0 },
  { name: "Буда-Кошелево", priority: 0 },
  { name: "Быхов", priority: 0 },
  { name: "Василевичи", priority: 0 },
  { name: "Верхнедвинск", priority: 0 },
  { name: "Ветка", priority: 0 },
  { name: "Вилейка", priority: 0 },
  { name: "Витебск", priority: 0 },
  { name: "Волковыск", priority: 0 },
  { name: "Воложин", priority: 0 },
  { name: "Высокое", priority: 0 },
  { name: "Ганцевичи", priority: 0 },
  { name: "Глубокое", priority: 0 },
  { name: "Гомель", priority: 4 },
  { name: "Горка", priority: 0 },
  { name: "Горки", priority: 0 },
  { name: "Городок", priority: 0 },
  { name: "Гродно", priority: 0 },
  { name: "Давид-Городок", priority: 0 },
  { name: "Дзержинск", priority: 0 },
  { name: "Дисна", priority: 0 },
  { name: "Добруш", priority: 0 },
  { name: "Докшицы", priority: 0 },
  { name: "Дрогичин", priority: 0 },
  { name: "Дубровно", priority: 0 },
  { name: "Дятлово", priority: 0 },
  { name: "Ельск", priority: 0 },
  { name: "Жабинка", priority: 0 },
  { name: "Житковичи", priority: 0 },
  { name: "Жлобин", priority: 0 },
  { name: "Жодино", priority: 0 },
  { name: "Заславль", priority: 0 },
  { name: "Иваново", priority: 0 },
  { name: "Ивацевичи", priority: 0 },
  { name: "Ивье", priority: 0 },
  { name: "Калинковичи", priority: 0 },
  { name: "Каменец", priority: 0 },
  { name: "Кировск", priority: 0 },
  { name: "Клецк", priority: 0 },
  { name: "Климовичи", priority: 0 },
  { name: "Кличев", priority: 0 },
  { name: "Кобрин", priority: 0 },
  { name: "Копыль", priority: 0 },
  { name: "Коссово", priority: 0 },
  { name: "Костюковичи", priority: 0 },
  { name: "Кричев", priority: 0 },
  { name: "Круглое", priority: 0 },
  { name: "Крупки", priority: 0 },
  { name: "Лепель", priority: 0 },
  { name: "Лида", priority: 0 },
  { name: "Логойск", priority: 0 },
  { name: "Лунинец", priority: 0 },
  { name: "Любань	", priority: 0 },
  { name: "Ляховичи", priority: 0 },
  { name: "Малорита", priority: 0 },
  { name: "Марьина", priority: 0 },
  { name: "Микашевичи", priority: 0 },
  { name: "Минск", priority: 5 },
  { name: "Миоры", priority: 0 },
  { name: "Могилёв", priority: 0 },
  { name: "Мозырь", priority: 0 },
  { name: "Молодечно", priority: 0 },
  { name: "Мосты", priority: 0 },
  { name: "Мстиславль", priority: 0 },
  { name: "Мядель", priority: 0 },
  { name: "Наровля", priority: 0 },
  { name: "Несвиж", priority: 0 },
  { name: "Новогрудок", priority: 0 },
  { name: "Новолукомль", priority: 0 },
  { name: "Новополоцк", priority: 0 },
  { name: "Орша", priority: 0 },
  { name: "Осиповичи", priority: 0 },
  { name: "Островец", priority: 0 },
  { name: "Ошмяны", priority: 0 },
  { name: "Петриков", priority: 0 },
  { name: "Пинск", priority: 0 },
  { name: "Полоцк", priority: 0 },
  { name: "Поставы", priority: 0 },
  { name: "Пружаны", priority: 0 },
  { name: "Речица", priority: 0 },
  { name: "Рогачёв", priority: 0 },
  { name: "Светлогорск", priority: 0 },
  { name: "Свислочь", priority: 0 },
  { name: "Сенно", priority: 0 },
  { name: "Скидель", priority: 0 },
  { name: "Славгород", priority: 0 },
  { name: "Слоним", priority: 0 },
  { name: "Слуцк", priority: 0 },
  { name: "Смолевичи", priority: 0 },
  { name: "Сморгонь", priority: 0 },
  { name: "Солигорск", priority: 0 },
  { name: "Старые Дороги", priority: 0 },
  { name: "Столбцы", priority: 0 },
  { name: "Столин", priority: 0 },
  { name: "Толочин", priority: 0 },
  { name: "Туров", priority: 0 },
  { name: "Узда", priority: 0 },
  { name: "Фаниполь", priority: 0 },
  { name: "Хойники", priority: 0 },
  { name: "Чаусы", priority: 0 },
  { name: "Чашники", priority: 0 },
  { name: "Червень", priority: 0 },
  { name: "Чериков", priority: 0 },
  { name: "Чечерск", priority: 0 },
  { name: "Шклов", priority: 0 },
  { name: "Щучин", priority: 0 },
];

module.exports = {
  cities,
};