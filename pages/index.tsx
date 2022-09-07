import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../components/layouts/ShopLayout";
import { PromotionsList } from "../components/products";
import { FullScreenLoading } from "../components/ui";
import { useGetAllPromotionsQuery } from "../store/RTKQuery/promotionApi";

const HomePage: NextPage = () => {
  const { data: promotions, isLoading } = useGetAllPromotionsQuery(null);

  return (
    <ShopLayout
      title="ShopApp - Home"
      pageDescription="Encuentra los mejores productos aqui"
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ marginBottom: 1, marginTop: 5 }}>
        Sushis
      </Typography>
      {isLoading && promotions ? (
        <FullScreenLoading />
      ) : (
        <PromotionsList promotions={promotions!} />
      )}
    </ShopLayout>
  );
};
export default HomePage;
