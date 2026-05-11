import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "./src/database/db.json");

//* GET method 
export const readProduct = () => {
  const products = fs.readFileSync(filePath, "utf-8");
  // console.log(products.toString());
  // console.log(JSON.parse(products));
  return JSON.parse(products);
};

//* POST method
export const insertProduct = (payload: any) => {
  console.log(payload);
  fs.writeFileSync(filePath, JSON.stringify(payload));
};
