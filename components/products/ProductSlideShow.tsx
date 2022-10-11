import { FC } from "react";
import { Slide, Zoom } from "react-slideshow-image";
import styles from "./ProductSlideShow.module.css";
import "react-slideshow-image/dist/styles.css";
import Image from "next/image";

interface Props {
  images: string[];
}

export const ProductSlideShow: FC<Props> = ({ images }) => {
  return (
    <Zoom scale={1.4} easing="ease" duration={5000}>
      {images.map((image, i) => {
        return (
          <div className={styles["each-slide"]} key={i}>
            <Image
              src={image}
              width="300px"
              height="300px"
              layout="responsive"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                height: "300px",
              }}
              loading="lazy"
            ></Image>
          </div>
        );
      })}
    </Zoom>
  );
};
