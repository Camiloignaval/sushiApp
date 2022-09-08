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
  promotionItems?: Array<String>;
  price: number;
  inOffer: boolean;
  inStock: boolean;
  description: string;
  images: Array<String>;
  name: string;
  lastPrice?: number;
  category: ValidCategory;
  quantity: number;
  unit: ValidUnit;
}

type ValidType = "envelope" | "filling" | "sauce";
type ValidEnvelopeType = "protein" | "vegetable";
type ValidCategory = "Promos" | "HandRolls";
type ValidUnit = "Piezas" | "Porciones" | "Rolls";

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
      fillingType: "protein",
      inStock: true,
      name: "Salmón",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662592222/SushiApp/fresh-raw-salmon-fillets-white-background-isolated-139497032_ig2kyb.jpg",
      price: 1200,
      type: "filling",
    },
    {
      fillingType: "protein",
      inStock: false,
      name: "Camarón",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662592698/SushiApp/depositphotos_237104958-stock-photo-shrimp-isolated-white-background-clipping_t8fdfh.webp",
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
      fillingType: "vegetable",
      inStock: true,
      name: "Esparrago",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662592771/SushiApp/fresh-asparagus-over-white-background-260nw-1715591050_ll5pzf.webp",
      price: 300,
      type: "filling",
    },
    {
      fillingType: "vegetable",
      inStock: true,
      name: "Choclo",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662592835/SushiApp/images_1_c8wzku.jpg",
      price: 300,
      type: "filling",
    },
    {
      inStock: true,
      name: "Palta",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662588287/SushiApp/TERY-ROLLS_kqcyzr.png",
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
      name: "Salmon",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662589386/SushiApp/5.1-Maki-Atun_v7m1p5.webp",
      price: 700,
      type: "envelope",
    },
    {
      inStock: true,
      name: "Queso",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662589482/SushiApp/queso_eprfzk.webp",
      price: 700,
      type: "envelope",
    },
    {
      inStock: false,
      name: "Sesamo",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662589736/SushiApp/sesamo_nqjzvt.png",
      price: 700,
      type: "envelope",
    },
    {
      inStock: true,
      name: "Nori",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662589802/SushiApp/single-avocado-sushi-maki-isolated-on-white-background-2H792KG_th7j84.jpg",
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
      quantity: 60,
      unit: "Piezas",
      category: "Promos",
      images: [
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528515/SushiApp/32-piezas-fritas-e1556327712206_bq4exp.jpg",
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528900/SushiApp/descarga_2_k7mldi.jpg",
      ],
    },
    {
      promotionItems: ["20 piezas tempura"],
      description: "La mejor promocion de todas",
      inOffer: false,
      inStock: true,
      price: 6000,
      name: "Promo tempura 20 piezas",
      quantity: 20,
      unit: "Piezas",
      category: "Promos",
      images: [
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528515/SushiApp/32-piezas-fritas-e1556327712206_bq4exp.jpg",
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528900/SushiApp/descarga_2_k7mldi.jpg",
      ],
    },
    {
      promotionItems: ["20 Pollo palta frita"],
      description: "La mejor promocion de todas",
      inOffer: false,
      inStock: true,
      price: 8000,
      name: "Promo salmon 20 piezas",
      quantity: 20,
      unit: "Piezas",
      category: "Promos",
      images: [
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528515/SushiApp/32-piezas-fritas-e1556327712206_bq4exp.jpg",
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528900/SushiApp/descarga_2_k7mldi.jpg",
      ],
    },
    {
      promotionItems: ["30 piezas palta", "40 Salmon camaron"],
      description: "La segunda mejor promocion de todas",
      inOffer: true,
      inStock: true,
      name: "Promo el mar",
      price: 18000,
      lastPrice: 20000,
      quantity: 70,
      unit: "Piezas",
      category: "Promos",
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
      ],
      description: "La mejor promocion de todas 2",
      inOffer: false,
      inStock: false,
      price: 12000,
      quantity: 100,
      unit: "Piezas",
      name: "Promo tempura 2",
      category: "Promos",

      images: [
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528515/SushiApp/32-piezas-fritas-e1556327712206_bq4exp.jpg",
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528900/SushiApp/descarga_2_k7mldi.jpg",
      ],
    },
    {
      promotionItems: ["30 piezas palta", "40 Salmon camaron"],
      description: "La segunda mejor ",
      inOffer: false,
      inStock: false,
      name: "Promo el mar 2",
      category: "Promos",
      quantity: 70,
      unit: "Piezas",
      price: 18000,
      images: [
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528935/SushiApp/descarga_3_urwkds.jpg",
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662528978/SushiApp/zeisushi-promo5-55-bocados-mixtos_tbwtzf.jpg",
      ],
    },
    {
      description: "Roll envuelto en palta relleno con salmon y camaron",
      inOffer: false,
      inStock: true,
      name: "Roll envuelto en palta",
      category: "HandRolls",
      quantity: 1,
      unit: "Rolls",
      price: 18000,
      images: [
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662576137/SushiApp/descarga_4_wptos4.jpg",
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662576191/SushiApp/images_pekrlp.jpg",
      ],
    },
    {
      description:
        "Roll bañado en salsa acevichada relleno con pollo y camaron",
      inOffer: false,
      inStock: true,
      name: "Roll con salsa acevichada",
      category: "HandRolls",
      quantity: 1,
      unit: "Rolls",
      price: 18000,
      images: [
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662576232/SushiApp/descarga_5_tmtc1q.jpg",
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662576258/SushiApp/5tSTpHyngLQvze9Qt-350-350_hyy6tx.webp",
      ],
    },
  ],
};
