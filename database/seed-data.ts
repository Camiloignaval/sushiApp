import bcrypt from "bcryptjs";

interface SeedProduct {
  image: string;
  inStock: boolean;
  price: number;
  name: string;
  fillingType?: ValidEnvelopeType;
  type: ValidType;
}
interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "client" | "delivery";
}

interface SeedPromotion {
  promotionItems: Array<String>;
  price: number;
  inOffer: boolean;
  inStock: boolean;
  description: string;
  images: Array<String>;
  name: string;
}

type ValidType = "envelope" | "filling" | "sauce";
type ValidEnvelopeType = "protein" | "vegetable";

interface SeedData {
  products: SeedProduct[];
  users: SeedUser[];
  promotions: SeedPromotion[];
}

export const initialData: SeedData = {
  products: [
    {
      fillingType: "protein",
      inStock: true,
      name: "Pollo",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662526991/SushiApp/istockphoto-1134331114-170667a_zzwbj1.jpg",
      price: 500,
      type: "filling",
    },
    {
      fillingType: "vegetable",
      inStock: true,
      name: "Palmito",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662527019/SushiApp/istockphoto-482878473-612x612_ura4ua.jpg",
      price: 300,
      type: "filling",
    },
    {
      inStock: true,
      name: "Palta",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662527153/SushiApp/descarga_1_u2xkqg.jpg",
      price: 500,
      type: "envelope",
    },
    {
      inStock: true,
      name: "Tempura",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662527124/SushiApp/descarga_bfdq06.jpg",
      price: 700,
      type: "envelope",
    },
    {
      inStock: true,
      name: "Soja",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662527168/SushiApp/Soy_sauce_2_lnawfh.jpg",
      price: 700,
      type: "sauce",
    },
    {
      inStock: true,
      name: "Agridulce",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662527168/SushiApp/Soy_sauce_2_lnawfh.jpg",
      price: 700,
      type: "sauce",
    },
  ],
  users: [
    {
      name: "Camilo Valenzuela",
      email: "camiloignaval@gmail.com",
      password: bcrypt.hashSync("123456"),
      role: "admin",
    },
    {
      name: "Jael Burgos",
      email: "jburgos@gmail.com",
      password: bcrypt.hashSync("123456"),
      role: "client",
    },
  ],
  promotions: [
    {
      promotionItems: ["20 piezas tempura", "40 Pollo palta frita"],
      description: "La mejor promocion de todas",
      inOffer: false,
      inStock: true,
      price: 12000,
      name: "Promo tempura",
      images: [
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528515/SushiApp/32-piezas-fritas-e1556327712206_bq4exp.jpg",
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528900/SushiApp/descarga_2_k7mldi.jpg",
      ],
    },
    {
      promotionItems: ["30 piezas palta", "40 Salmon camaron"],
      description: "La segunda mejor promocion de todas",
      inOffer: false,
      inStock: true,
      name: "Promo el mar",
      price: 18000,
      images: [
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528935/SushiApp/descarga_3_urwkds.jpg",
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528978/SushiApp/zeisushi-promo5-55-bocados-mixtos_tbwtzf.jpg",
      ],
    },
    {
      promotionItems: [
        "20 piezas tempura",
        "40 Pollo palta frita",
        "20 piezas tempura",
        "40 Pollo palta frita",
        "20 piezas tempura",
        "40 Pollo palta frita",
      ],
      description: "La mejor promocion de todas 2",
      inOffer: false,
      inStock: false,
      price: 12000,
      name: "Promo tempura 2",
      images: [
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528515/SushiApp/32-piezas-fritas-e1556327712206_bq4exp.jpg",
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528900/SushiApp/descarga_2_k7mldi.jpg",
      ],
    },
    {
      promotionItems: ["30 piezas palta", "40 Salmon camaron"],
      description: "La segunda mejor ",
      inOffer: false,
      inStock: true,
      name: "Promo el mar 2",
      price: 18000,
      images: [
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528935/SushiApp/descarga_3_urwkds.jpg",
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528978/SushiApp/zeisushi-promo5-55-bocados-mixtos_tbwtzf.jpg",
      ],
    },
  ],
};
