import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;
  const urlParts = url?.split("/");
  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;

  if (method === "GET" && url === "/products") {
    const products = readProduct();
    return sendResponse(res, 200, true, "This is products route", products);
  } else if (method === "GET" && id !== null) {
    const products = readProduct();
    const product = products.find((p: IProduct) => p.id === id);
    if (!product) {
      return sendResponse(res, 404, false, "Product not found", null);
    }
    return sendResponse(
      res,
      200,
      true,
      "This is single product route",
      product,
    );
  } else if (method === "POST" && url === "/products") {
    const body = await parseBody(req);
    const newProduct = {
      id: Date.now(),
      ...body,
    };
    const products = readProduct();
    products.push(newProduct);
    console.log(products);
    insertProduct(products);

    return sendResponse(
      res,
      200,
      true,
      "This is single product route",
      products,
    );
  } else if (method === "PUT" && id !== null) {
    const body = await parseBody(req);

    const products = readProduct();
    const index = products.findIndex((p: IProduct) => p.id === id);
    if (index < 0) {
      return sendResponse(res, 404, false, "Product not found", null);
    }
    products[index] = { id: products[index].id, ...body };
    console.log(products);
    insertProduct(products);
    return sendResponse(
      res,
      200,
      true,
      "Product updated successfully",
      products[index],
    );
  } else if (method === "DELETE" && id !== null) {
    const products = readProduct();
    const index = products.findIndex((p: IProduct) => p.id === id);
    if (index < 0) {
      return sendResponse(res, 404, false, "Product not found", null);
    }
    products.splice(index, 1);
    console.log(products);
    insertProduct(products);
    return sendResponse(
      res,
      200,
      true,
      "Product deleted successfully",
      products[index],
    );
  } else {
    return sendResponse(res, 404, false, "Product not found", null);
  }
};
