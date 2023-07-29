const hairServices = [];

const depilationServices = [];

const massageServices = [];

const nailServices = [];

const browServices = [];

const eyelashesServices = [];

const faceServices = [];

const bodyServices = [];

const manServices = [];

const categories = [
  { name: "Волосы", services: hairServices },
  { name: "Удаление Волос", services: depilationServices },
  { name: "Массаж", services: massageServices },
  { name: "Ногти", services: nailServices },
  { name: "Брови", services: browServices },
  { name: "Ресницы", services: eyelashesServices },
  { name: "Лицо", services: faceServices },
  { name: "Тело", services: bodyServices },
  { name: "Мужское", services: manServices },
];

module.exports = {
  categories,
};
