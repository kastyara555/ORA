const fs = require("fs");
const { categories: categoriesObject } = require("../db/consts/categories");

// экспорт категорий из экселя в csv, затем преобразуем тут https://www.convertcsv.com/csv-to-json.htm

const categoriesFromExcel = []
  .filter(
    ({ FIELD4, FIELD7, FIELD9, FIELD11 }) =>
      !!FIELD4.length &&
      (!!FIELD7.length || !!FIELD9.length || !!FIELD11.length)
  )
  .map(({ FIELD4, FIELD7, FIELD9, FIELD11 }) => {
    const categories = [];

    if (FIELD7.length) {
      categories.push(FIELD7);
    }

    if (FIELD9.length) {
      categories.push(FIELD9);
    }

    if (FIELD11.length) {
      categories.push(FIELD11);
    }

    return {
      name: FIELD4,
      categories: categories.map((category) => {
        const [tmp] = Object.entries(categoriesObject).find(
          ([_, { name: categoryName }]) => categoryName === category
        );

        return `%categories.${tmp}%`;
      }),
    };
  });

fs.writeFile("./output", JSON.stringify(categoriesFromExcel), function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("The file was saved!");
});
