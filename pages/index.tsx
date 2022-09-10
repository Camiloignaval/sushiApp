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
import type { NextPage } from "next";
import NextLink from "next/link";
import { Link } from "react-scroll";
import { useEffect, useState } from "react";

import { PromotionCategory } from "../components/products/PromotionCategory";
import { IPromotion } from "../interfaces";
import { useGetAllPromotionsQuery } from "../store/RTKQuery/promotionApi";
import { DrawerCustomRoll } from "../components/customRoll/DrawerCustomRoll";
import { useDispatch, useSelector } from "react-redux";
import { activeScrollDown, desactiveScrollDown } from "../store/Slices/UISlice";
import { RootState } from "../store";
import { currency } from "../utils";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MainShopLayout } from "../components/layouts";
import { FaCircle } from "react-icons/fa";

const categoriesBBDD = ["HandRolls", "Promos"];

interface IObjectKeys {
  [key: string]: string | number;
}

const HomePage: NextPage = () => {
  const { data: promotions, isLoading } = useGetAllPromotionsQuery(null);
  const { scrollIsDown } = useSelector((state: RootState) => state.ui);
  const { numberOfItems, total } = useSelector(
    (state: RootState) => state.cart
  );
  const [promosByCategory, setPromosByCategory] = useState({});
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

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
    if (promotions) {
      let promosSeparate = {};

      promotions?.forEach((promo: IPromotion) => {
        const nameCategory = promo.category.name.toString();
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
        {categoriesBBDD.map((category) => (
          <>
            <Link
              activeClass="active"
              to={category}
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
              {category}
            </Link>
            <FaCircle
              style={{ width: "10px", position: "relative", top: 18 }}
            />
          </>
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
      {/* // TODO POR ALGUNA RAZON AL PONER MOBILE NO FUNCIONA PERO SI EN RESONSIVE */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          position: "sticky",
          height: "10px",
          top: 1083,
          marginLeft: 5,
          zIndex: 200,
          color: "red",
        }}
      >
        <Card
          sx={{
            width: "70px",
            height: "70px",
            boxShadow: "5px 5px 15px 5px rgba(0,0,0,0.51)",
          }}
        >
          <Box display={"flex"} justifyContent="center" marginTop={0.8}>
            <NextLink href="/cart" passHref>
              <MuiLink>
                <IconButton>
                  <Badge
                    badgeContent={numberOfItems > 9 ? "+9" : numberOfItems}
                    color="secondary"
                  >
                    <AiOutlineShoppingCart />
                  </Badge>
                </IconButton>
              </MuiLink>
            </NextLink>
          </Box>

          <Box
            display={"flex"}
            position="relative"
            bottom={4}
            justifyContent="center"
          >
            <Typography color={"primary"} variant="body2">
              {currency.format(total)}
            </Typography>
          </Box>
        </Card>
      </Box>
      {Object.values(promosByCategory).length > 0
        ? Object.entries(promosByCategory)?.map((promotion) => (
            <PromotionCategory promotions={promotion} />
          ))
        : undefined}
    </MainShopLayout>
  );
};
export default HomePage;
