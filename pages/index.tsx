import {
  Box,
  Tab,
  Tabs,
  Typography,
  Link as MuiLink,
  Badge,
  IconButton,
  Card,
} from "@mui/material";
import type { GetServerSideProps, NextPage } from "next";
import { Link } from "react-scroll";

import { PromotionCategory } from "../components/products/PromotionCategory";
import { ICategory, IPromotion } from "../interfaces";
import { useGetAllPromotionsQuery } from "../store/RTKQuery/promotionApi";
import { DrawerCustomRoll } from "../components/customRoll/DrawerCustomRoll";
import { useDispatch, useSelector } from "react-redux";
import { activeScrollDown, desactiveScrollDown } from "../store/Slices/UISlice";
import { RootState } from "../store";
import { currency } from "../utils";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MainShopLayout } from "../components/layouts";
import { FaCircle } from "react-icons/fa";
import { useGetCategoriesQuery } from "../store/RTKQuery/categoriesApi";
import { dbCategories, dbPromotions } from "../database";
import { useState, useEffect } from "react";
import { CartInMobile } from "../components/cart/CartInMobile";

interface Props {
  promotions: IPromotion[];
  categories: ICategory[];
}

const HomePage: NextPage<Props> = ({ promotions, categories }) => {
  const { scrollIsDown } = useSelector((state: RootState) => state.ui);
  const [promosByCategory, setPromosByCategory] = useState({});
  const [open, setOpen] = useState(false);
  const [positionOfMobileCart, setpositionOfMobileCart] = useState(40);
  const dispatch = useDispatch();

  console.log({ promotions });

  function logit() {
    const isDownOfTheScreen = window.pageYOffset > window.innerHeight - 100;
    if (isDownOfTheScreen) {
      if (scrollIsDown) {
        return;
      } else {
        dispatch(activeScrollDown());
      }
    } else {
      if (!scrollIsDown) {
        return;
      } else {
        dispatch(desactiveScrollDown());
      }
    }
  }
  useEffect(() => {
    function watchScroll() {
      window.addEventListener("scroll", logit);
    }
    watchScroll();
    return () => {
      window.removeEventListener("scroll", logit);
    };
  });

  useEffect(() => {
    if (typeof window !== undefined) {
      setpositionOfMobileCart(window.innerHeight - 100);
    }
  }, []);

  useEffect(() => {
    if (promotions) {
      let promosSeparate: any = {};
      console.log({ promotions });
      promotions!.forEach((promo: IPromotion) => {
        const nameCategory = promo?.category?.name;
        promosSeparate = {
          ...promosSeparate,
          [nameCategory]: promosSeparate[nameCategory]
            ? [...promosSeparate[nameCategory], promo]
            : [promo],
        };
      });
      setPromosByCategory(promosSeparate);
      console.log({ promosSeparate });
    }
  }, [promotions]);

  return (
    <MainShopLayout
      title="ShopApp - Home"
      pageDescription="Encuentra los mejores productos aqui"
    >
      <DrawerCustomRoll open={open} setOpen={setOpen} />
      <Tabs
        id="tabsCategorys"
        sx={{
          position: "sticky",
          height: "50px",
          top: 60,
          zIndex: 200,
          background: scrollIsDown
            ? "linear-gradient(270deg, rgba(255,255,255,0) 0%, rgba(167,0,0,1) 9%, rgba(167,0,0,1) 54%, rgba(167,0,0,1) 91%, rgba(255,255,255,0) 100%)"
            : undefined,
          color: scrollIsDown ? "white" : "black",
        }}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
      >
        {(categories ?? []).map((category) => (
          <Box key={category._id}>
            <Link
              activeClass="active"
              to={category.name}
              spy={true}
              smooth={true}
              duration={500}
              style={{
                display: "inline-block",
                margin: "20px",
                position: "relative",
                top: -15,
                fontSize: "1.7rem",
                letterSpacing: 4,
                cursor: "pointer",
              }}
              offset={-120}
            >
              {category.name}
            </Link>
            <FaCircle
              style={{ width: "10px", position: "relative", top: 18 }}
            />
          </Box>
        ))}

        {/* arma tu roll button */}
        <Box
          sx={{
            display: "inline-block",
            margin: "20px",
            position: "relative",
            top: -15,
          }}
          onClick={() => setOpen(true)}
        >
          <Typography
            sx={{
              top: -15,
              fontSize: "1.7rem",
              letterSpacing: 4,
              cursor: "pointer",
            }}
          >
            Arma tu roll
          </Typography>
        </Box>
      </Tabs>
      {/* carrito para mobiles */}
      {/* // TODO POR ALGUNA RAZON AL PONER MOBILE NO FUNCIONA PERO SI EN RESPONSIVE */}

      <CartInMobile positionOfMobileCart={positionOfMobileCart} />

      {Object.values(promosByCategory).length > 0
        ? Object.entries(promosByCategory)?.map((promotion, i) => (
            <PromotionCategory key={i} promotions={promotion} />
          ))
        : undefined}
    </MainShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const promotions = await dbPromotions.getAllPromotions();
  const categories = await dbCategories.getCategories();

  return {
    props: { promotions, categories },
  };
};

export default HomePage;
