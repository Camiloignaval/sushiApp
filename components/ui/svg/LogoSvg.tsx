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
    pathLength: 1,
    fill: "rgba(0, 0, 0, 0)",
  },
};
const iconOut = {
  hidden: {
    pathLength: 1,
    fill: "rgba(0, 0, 0, 0)",
  },
  visible: {
    pathLength: 0,
    fill: "rgba(0, 0, 0, 0)",
  },
};

export const LogoSvg = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  }, []);

  return (
    <Box
      className="tituloSucus"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
      <Box className={styles["fondoSvg"]} /* position={"absolute"} */>
        <Image
          src="/logos/logo-sushi-panko-sin-fondo.png"
          alt="logo"
          width={600}
          height={515}
        />
      </Box>

      <Box sx={{ zIndex: 9999 }}>
        <motion.svg
          className={styles["item"]}
          xmlns="http://www.w3.org/2000/svg"
          width="841.333"
          height="322.667"
          version="1"
          viewBox="0 0 631 242"
        >
          {arrayPath.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              transform="matrix(.1 0 0 -.1 0 900)"
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
      </Box>
    </Box>
  );
};
