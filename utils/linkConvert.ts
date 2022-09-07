import { IProduct } from "../interfaces";

export const linkConvert = (products: IProduct[]) => {
  return products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });
};
