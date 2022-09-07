import { Typography } from "@mui/material";
import type { NextPage, GetServerSideProps } from "next";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { ProductList } from "../../components/products";
import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces";

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout
      title="ShopApp - Search"
      pageDescription="Encuentra los mejores productos aqui"
    >
      <Typography variant="h1" component="h1">
        Buscar productos
      </Typography>
      <Typography
        textTransform="capitalize"
        variant="h2"
        sx={{ marginBottom: 1 }}
      >
        {foundProducts
          ? `${products.length} resultados para ${query}`
          : `No se encontraron resultados para ${query}`}
      </Typography>
      <ProductList products={products} />
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (query.length === 0)
    return { redirect: { destination: "/", permanent: true } };

  let products = await dbProducts.getProductsByTerm(query); // your fetch function here
  const foundProducts = products.length > 0;
  // todo si no hay productos retornar otros
  if (!foundProducts) {
    products = await dbProducts.getAllProducts();
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};
export default SearchPage;
