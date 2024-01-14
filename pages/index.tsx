import {
  Box,
  Tab,
  Tabs,
  Typography,
  Link as MuiLink,
  Badge,
  IconButton,
  Card,
  TextField,
  InputBase,
  Grid,
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
import { optimizeRoute } from "../utils/optimizeRoute";
import { LogoSvg } from "../components/ui/svg/LogoSvg";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  promotions: IPromotion[];
  categories: ICategory[];
}

const HomePage: NextPage<Props> = ({ promotions, categories }) => {
  const { scrollIsDown } = useSelector((state: RootState) => state.ui);
  const [promosByCategory, setPromosByCategory] = useState({});
  const [open, setOpen] = useState(false);
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [positionOfMobileCart, setpositionOfMobileCart] = useState(40);
  const dispatch = useDispatch();
  const { store } = useSelector((state: RootState) => state.ui);

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
      categories.forEach((cat) => {
        promosSeparate[cat.name as keyof object] = [];
      });
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
    }
  }, [promotions]);

  const prodFilters = promotions.filter((promo) =>
    promo?.name?.toLowerCase().includes(searchProduct?.toLowerCase())
  );

  return (
    <MainShopLayout
      title="SushiPanko"
      pageDescription="Encuentra los mejores Sushis y más!"
      imageFullUrl="https://res.cloudinary.com/dc6vako2z/image/upload/v1664357167/SushiApp/logo-sushi-panko_qtifjs.webp"
    >
      <DrawerCustomRoll open={open} setOpen={setOpen} />
      <LogoSvg />
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
                top: -11,
                fontSize: "1.7rem",
                letterSpacing: 4,
                cursor: "pointer",
              }}
              offset={-120}
            >
              <Typography
                sx={{ fontStyle: "italic", fontWeight: 500 }}
                variant="h5"
              >
                {category.name}
              </Typography>
              {/* {category.name} */}
            </Link>
            <FaCircle
              style={{
                width: "10px",
                position: "relative",
                top: -11,
                color: scrollIsDown ? "white" : "red",
                zIndex: 1000,
              }}
            />
          </Box>
        ))}

        {/* arma tu roll button */}
        <Box
          sx={{
            display: "inline-block",
            margin: "20px",
            position: "relative",
            top: -11,
          }}
          onClick={() => setOpen(true)}
        >
          <Typography
            variant="h5"
            sx={{
              top: -15,
              // fontSize: "1.7rem",
              // letterSpacing: 4,
              cursor: "pointer",
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            Arma tu roll
          </Typography>
        </Box>
      </Tabs>

      <Grid
        container
        justifyContent={"end"} /* display={"flex"} justifyContent={"end"} */
      >
        <Grid container item xs={12} sm={6} md={4}>
          <Grid item xs={11}>
            <InputBase
              onChange={(e) => setSearchProduct(e.target.value)}
              value={searchProduct}
              fullWidth
              // sx={{ ml: 1, flex: 1 }}
              placeholder="Busca tu producto"
              // inputProps={{ "aria-label": "search google maps" }}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton
              type="button"
              /* sx={{ p: "10px" }} */ aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      {/* carrito para mobiles */}

      {store.type !== "close" && (
        <CartInMobile positionOfMobileCart={positionOfMobileCart} />
      )}

      {store.type === "close" && (
        <Box height={store.type === "close" ? "60px" : ""}></Box>
      )}
      {searchProduct ? (
        <>
          <PromotionCategory
            promotions={["Productos encontrados", prodFilters]}
          />
          {!prodFilters.length && (
            <Typography sx={{ fontStyle: "italic", mt: 4 }}>
              No se han encontrado productos para {searchProduct}{" "}
            </Typography>
          )}
        </>
      ) : Object.values(promosByCategory).length > 0 ? (
        Object.entries(promosByCategory)?.map((promotion, i) => (
          <PromotionCategory key={i} promotions={promotion} />
        ))
      ) : undefined}
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
