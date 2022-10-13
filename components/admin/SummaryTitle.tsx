import { Grid, Card, CardContent, Typography } from "@mui/material";
import CardActionArea from "@mui/material/CardActionArea";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { Facebook } from "react-content-loader";
import { DashboardSkeleton } from "../skeletons";

interface Props {
  title: string;
  subTitle: string;
  icon: JSX.Element;
  link?: string;
  isLoading?: boolean;
  sizeInMd?: number;
  color?: string;
}

export const SummaryTitle: FC<Props> = ({
  title,
  subTitle,
  icon,
  link = undefined,
  isLoading = false,
  sizeInMd = 3,
  color = "primary",
}) => {
  const router = useRouter();
  return (
    <>
      <Grid item xs={12} sm={4} md={sizeInMd}>
        {isLoading ? (
          // <DashboardSkeleton />
          <Facebook />
        ) : (
          <Card
            onClick={() => (link ? router.push(link) : undefined)}
            sx={{ display: "flex", cursor: link ? "pointer" : undefined }}
          >
            <CardContent
              sx={{
                width: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {icon}
            </CardContent>
            <CardContent
              sx={{
                flex: "1 0 auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography color={color} variant="h3">
                {title}
              </Typography>
              <Typography variant="subtitle2">{subTitle}</Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
    </>
  );
};
