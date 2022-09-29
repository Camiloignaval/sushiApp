import { Box, Card, IconButton, Badge, Typography, Link } from "@mui/material";
import React, { FC } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { currency } from "../../utils";
import NextLink from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface Props {
  positionOfMobileCart: number;
}

export const CartInMobile: FC<Props> = ({ positionOfMobileCart }) => {
  const { numberOfItems, total } = useSelector(
    (state: RootState) => state.cart
  );
  return (
    <NextLink href="/cart" passHref>
      <Link>
        <Box
          sx={{
            mt: 4,
            display: { xs: "flex", sm: "none" },
            position: "sticky",
            height: "10px",
            top: positionOfMobileCart,
            marginLeft: 1.5,
            zIndex: 900,
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
              <IconButton>
                <Badge
                  badgeContent={numberOfItems > 9 ? "+9" : numberOfItems}
                  color="secondary"
                >
                  <AiOutlineShoppingCart />
                </Badge>
              </IconButton>
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
      </Link>
    </NextLink>
  );
};
