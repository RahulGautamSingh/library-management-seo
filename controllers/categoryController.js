const Category = require("../models/category");

const printAllCategories = async () => {
  let categories = await Category.find();
  console.log("-------");
  if (categories.length === 0) console.log("No categories to show");
  else {
    categories.forEach((elem) => {
      console.log(elem.name);
      console.log("---------");
    });
    return categories
  }
};

const addNewCategory = async (categoryName) => {
  let category = new Category({ name: categoryName });
  await category.save();
};
const removeCategory = async (categoryName) => {
  let result = await Category.find(); // result = await Category.findOne({name:categoryName}) -> result===undefined -> err
  result = result.filter((elem) => elem.name === categoryName);
  if (result.length !== 0) {
    await result[0].remove();
  } else {
    console.log("Category not found");
  }
};
module.exports = {
  printAllCategories,
  addNewCategory,
  removeCategory,
};
