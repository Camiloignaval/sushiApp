import { FC } from "react";
import { Slide, Zoom } from "react-slideshow-image";
import styles from "./ProductSlideShow.module.css";
import "react-slideshow-image/dist/styles.css";

interface Props {
  images: string[];
}

export const ProductSlideShow: FC<Props> = ({ images }) => {
  return (
    <Zoom scale={1.4} easing="ease" duration={5000}>
      {images.map((image, i) => {
        return (
          <div className={styles["each-slide"]} key={i}>
            <div
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                height: "300px",
              }}
            ></div>
          </div>
        );
      })}
    </Zoom>
  );
};
