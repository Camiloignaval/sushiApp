import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { CustomRoll } from "../components/customRoll";
import { ShopLayout } from "../components/layouts/ShopLayout";
import { PromotionsList } from "../components/products";
import { PromotionCategory } from "../components/products/PromotionCategory";
import { FullScreenLoading } from "../components/ui";
import { IPromotion } from "../interfaces";
import { useGetAllPromotionsQuery } from "../store/RTKQuery/promotionApi";

const HomePage: NextPage = () => {
  const { data: promotions, isLoading } = useGetAllPromotionsQuery(null);
  const [promosByCategory, setPromosByCategory] = useState({});

  useEffect(() => {
    if (promotions) {
      console.log(promotions);
      let promosSeparate = {};

      promotions?.forEach((promo: IPromotion) => {
        const nameCategory = promo.category.toString();
        promosSeparate = {
          ...promosSeparate,
          [nameCategory]: promosSeparate[nameCategory]
            ? [...promosSeparate[nameCategory], promo]
            : [promo],
        };
      });
      setPromosByCategory(promosSeparate);
    }
  }, [promotions]);

  return (
    <ShopLayout
      title="ShopApp - Home"
      pageDescription="Encuentra los mejores productos aqui"
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <CustomRoll />

      {Object.values(promosByCategory).length > 0
        ? Object.entries(promosByCategory)?.map((promotion) => (
            <PromotionCategory promotions={promotion} />
          ))
        : undefined}
    </ShopLayout>
  );
};
export default HomePage;
