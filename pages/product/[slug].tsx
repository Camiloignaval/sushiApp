import { Button, Chip, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductSlideShow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { GetServerSideProps } from "next";
import { dbProducts } from "../../database";
import { useState } from "react";
import { ICartProduct, IProduct, ISize } from "../../interfaces";
import { useDispatch, useSelector } from "react-redux";
import { addOrUpdateCart } from "../../store/Slices/CartSlice";
import { RootState } from "../../store";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cart } = useSelector((state: RootState) => state.cart);
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const onSizeClick = (size: ISize) => {
    setTempCartProduct((prev) => ({
      ...prev,
      size,
    }));
  };
  const updatedQuantity = (quantity: number) => {
    setTempCartProduct((prev) => ({
      ...prev,
      quantity,
    }));
  };

  const alertGoToCart = () => {
    Swal.fire({
      title: "Quieres seguir comprando?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si!",
      confirmButtonColor: "#3A64D8",
      denyButtonColor: "#3A64D8",
      denyButtonText: `No, continuar al carrito`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        router.push("/");
      } else if (result.isDenied) {
        router.push("/cart");
      }
    });
  };

  const onAddToCart = () => {
    const productFind = cart.some(
      (p) => p._id === tempCartProduct._id && p.size === tempCartProduct.size
    );
    if (!productFind) {
      alertGoToCart();
      return dispatch(addOrUpdateCart([...cart, tempCartProduct]));
    }
    // si el producto ya esta en el carrito tanto id como size, solo aumenta la cantidad
    const updatedProducts = cart.map((p) => {
      if (p._id !== tempCartProduct._id) return p;
      if (p.size !== tempCartProduct.size) return p;

      return { ...p, quantity: p.quantity + tempCartProduct.quantity };
    });

    dispatch(addOrUpdateCart(updatedProducts));
    alertGoToCart();
  };

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          {/* slideshow */}
          <ProductSlideShow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          {/* titulos */}
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography
              variant="subtitle1"
              component="h2"
              sx={{ marginBottom: 1 }}
            >
              ${product.price}
            </Typography>
          </Box>
          {/* Cantidad */}
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Cantidad</Typography>
            <ItemCounter
              currentValue={tempCartProduct.quantity}
              updatedQuantity={updatedQuantity}
              maxValue={product.inStock}
            />
            <SizeSelector
              sizes={product.sizes}
              selectedSize={tempCartProduct.size}
              onSizeClick={onSizeClick}
            />
          </Box>
          {/* agregar al carrito
           */}
          {product.inStock > 0 ? (
            <Button
              onClick={onAddToCart}
              className="circular-btn"
              variant="contained"
              color="secondary"
              fullWidth
              disabled={!tempCartProduct.size}
            >
              {tempCartProduct.size
                ? "Agregar al carrito"
                : "Selecciona una talla"}
            </Button>
          ) : (
            <Chip label="No hay disponible" color="error" variant="outlined" />
          )}
          {/* <Chip label="No hay disponibles" color="error" /> */}
          {/* descripción */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Descripción</Typography>
            <Typography variant="body2">{product.description}</Typography>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// EVITAR USAR SERVERSIDEPROPS
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   // const { data } = await  // your fetch function here
//   const { slug = "" } = params as { slug: string };
//   const product = await dbProducts.getProductBySlug(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       product,
//     },
//   };
// };

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await dbProducts.getAllProductsSlugs();

  return {
    paths: slugs.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };
  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 86400, // 1 day
  };
};

export default ProductPage;
