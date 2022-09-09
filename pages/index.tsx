import {
  Box,
  Tab,
  Tabs,
  Typography,
  Link as MuiLink,
  Badge,
  IconButton,
  Button,
  Card,
} from "@mui/material";
import type { NextPage } from "next";
import NextLink from "next/link";
import { Link, Element, animateScroll as scroll } from "react-scroll";
import { useEffect, useRef, useState } from "react";
import { CustomRoll } from "../components/customRoll";
import { ShopLayout } from "../components/layouts/ShopLayout";
import { PromotionCategory } from "../components/products/PromotionCategory";
import { IPromotion } from "../interfaces";
import { useGetAllPromotionsQuery } from "../store/RTKQuery/promotionApi";
import { DrawerCustomRoll } from "../components/customRoll/DrawerCustomRoll";
import { useDispatch, useSelector } from "react-redux";
import { activeScrollDown, desactiveScrollDown } from "../store/Slices/UISlice";
import { RootState } from "../store";
import { currency } from "../utils";
import { AiOutlineShoppingCart } from "react-icons/ai";

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
    console.log(isDownOfTheScreen, window.pageYOffset, window.innerHeight + 50);
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
      <DrawerCustomRoll open={open} setOpen={setOpen} />
      <Tabs
        id="tabsCategorys"
        sx={{
          position: "sticky",
          height: "50px",
          top: 60,
          zIndex: 200,
          // background: "rgb(255,255,255)",
          background: scrollIsDown
            ? "linear-gradient(270deg, rgba(255,255,255,0) 0%, rgba(167,0,0,1) 9%, rgba(167,0,0,1) 54%, rgba(167,0,0,1) 91%, rgba(255,255,255,0) 100%)"
            : undefined,
          color: scrollIsDown ? "white" : "black",
          // backdropFilter: !scrollIsDown ? "blur(9px)" : undefined,
        }}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
      >
        <Link
          activeClass="active"
          to="HandRolls"
          spy={true}
          smooth={true}
          duration={500}
          style={{
            display: "inline-block",
            margin: "20px",
            position: "relative",
            top: -8,
          }}
          offset={-120}
        >
          Handroll
        </Link>
        {"|"}
        <Link
          activeClass="active"
          to="Promos"
          spy={true}
          smooth={true}
          duration={250}
          style={{
            display: "inline-block",
            margin: "20px",
            position: "relative",
            top: -8,
          }}
          offset={-120}
        >
          Promos
        </Link>
        <Box
          sx={{
            display: "inline-block",
            margin: "20px",
            position: "relative",
            top: -8,
          }}
          onClick={() => setOpen(true)}
        >
          <Typography>Arma tu roll</Typography>
        </Box>
      </Tabs>
      {/* carrito para mobiles */}
      // TODO POR ALGUNA RAZON AL PONER MOBILE NO FUNCIONA PERO SI EN RESONSIVE
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
    </ShopLayout>
  );
};
export default HomePage;
