import { Box, CardMedia } from "@mui/material";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Logo.module.css";
import Image from "next/image";
import { arrayPath } from "./arrayPath";

const iconIn = {
  hidden: {
    pathLength: 0,
    fill: "rgba(0, 0, 0, 0)",
  },
  visible: {
    pathLength: 2,
    fill: "rgba(0, 0, 0, 0)",
  },
};
const iconOut = {
  hidden: {
    pathLength: 2,
    fill: "rgba(0, 0, 0, 0)",
  },
  visible: {
    pathLength: 0,
    fill: "rgba(0, 0, 0, 0)",
  },
};

export const LogoSvg = () => {
  const [visible, setVisible] = useState(true);
  const [allVisible, setAllVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setAllVisible(false);
    }, 7000);
  }, []);

  return (
    <Box className={styles["boxLogo"]}>
      <Box className={styles["fondoSvg"]} /* position={"absolute"} */>
        <Image
          src="/logos/logo-sushi-panko-sin-fondo.png"
          alt="logo"
          width={600}
          height={515}
        />
      </Box>

      <Box
        sx={{
          zIndex: 9999,
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {allVisible && (
          <motion.svg
            className={styles["item"]}
            xmlns="http://www.w3.org/2000/svg"
            width="650"
            height="575"
            version="1"
            viewBox="0 0 470 430"
          >
            {arrayPath.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                transform="matrix(.1 0 0 -.1 10 925)"
                variants={visible ? iconIn : iconOut}
                initial="hidden"
                animate="visible"
                transition={{
                  default: { duration: 4, ease: "easeInOut" },
                  fill: { duration: 4, ease: [1, 0, 0.8, 1] },
                }}
              />
            ))}
          </motion.svg>
        )}
      </Box>
    </Box>
  );
};
