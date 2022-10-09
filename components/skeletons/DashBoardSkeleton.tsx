import React from "react";
import ContentLoader from "react-content-loader";
import { Code } from "react-content-loader";

export const DashboardSkeleton = (props: any) => (
  <ContentLoader
    speed={3}
    width={400}
    height={154.667}
    viewBox="0 0 400 154.667"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <path d="M 35 11.4 C 18.25 17.75 10 26.25 10 37 c 0 14.95 19.1 27.95 41.2 28 c 41.3 0.05 57.5 -33.8 24.3 -50.8 l -7 -3.55 l -15 -0.3 c -10.75 -0.2 -16 0.1 -18.5 1.05 z M 107.35 18.5 c -1.8 4.7 -5.1 4.55 84.35 4.25 l 83.8 -0.25 v -5 l -83.8 -0.25 c -73.85 -0.25 -83.85 -0.1 -84.35 1.25 z M 107 36.5 V 39 h 169 v -5 H 107 v 2.5 z M 107 51.5 V 55 h 169 v -7 H 107 v 3.5 z M 29 78 v 3 h 121.9 c 128.75 0 125.1 0.1 125.1 -3.6 V 75 H 29 v 3 z M 29 96.5 V 99 H 276.15 l -0.35 -2.25 l -0.3 -2.25 l -123.25 -0.25 L 29 94 v 2.5 z" />
  </ContentLoader>
);

export default DashboardSkeleton;
