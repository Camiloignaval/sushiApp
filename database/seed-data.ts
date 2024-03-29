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
  phone: string;
  password: string;
  address: string;
  placeId: string;
  role: "admin" | "client" | "delivery";
}

interface SeedCoupon {
  name: string;
  code: string;
  expire: boolean;
  expireIn?: string;
  startIn: string;
  qtyAvailable: number;
  qtyUsed: number;
  type: string; //  porcentaje o cantidad de $
  discount: number;
  maxDiscount?: number;
  minPurchase?: number;
}
interface SeedPromotion {
  promotionItems?: Array<String>;
  price: number;
  inOffer: boolean;
  offerPrice?: number;
  inStock: boolean;
  description: string;
  images: Array<String>;
  name: string;
  lastPrice?: number;
  category: string;
  quantity: number;
  unit: ValidUnit;
}

interface SeedCategory {
  name: string;
}

type ValidType = "envelope" | "filling" | "sauce" | "other";
type ValidEnvelopeType = "protein" | "vegetable";
type ValidUnit = "Piezas" | "Porciones" | "Rolls";

interface SeedData {
  products: SeedProduct[];
  users: SeedUser[];
  promotions: SeedPromotion[];
  categories: SeedCategory[];
  coupons: SeedCoupon[];
}

export const initialData: SeedData = {
  coupons: [
    {
      name: "Dia del niño",
      code: "SEUNNIÑO",
      expire: false,
      qtyAvailable: 5,
      startIn: "2022-10-10T21:37:34.828+00:00",
      qtyUsed: 0,
      type: "percentage", //  porcentaje o cantidad de $
      discount: 10,
      maxDiscount: 10000,
    },
    {
      name: "Inauguracion",
      code: "PANKO",
      startIn: "2022-09-10T21:37:34.828+00:00",
      expire: true,
      expireIn: "2022-10-10T21:37:34.828+00:00",
      qtyAvailable: 10,
      qtyUsed: 0,
      type: "money", //  porcentaje o cantidad de $
      discount: 5000,
      minPurchase: 30000,
    },
  ],
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
      name: "Salsa de soja",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662527168/SushiApp/Soy_sauce_2_lnawfh.jpg",
      price: 700,
      type: "sauce",
    },
    {
      inStock: true,
      name: "Salsa Agridulce",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662527168/SushiApp/Soy_sauce_2_lnawfh.jpg",
      price: 700,
      type: "sauce",
    },
    {
      inStock: true,
      name: "Jengibre",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662794132/SushiApp/jengibre-encurtido-sushi_juvosh.jpg",
      price: 500,
      type: "other",
    },
    {
      inStock: true,
      name: "Wasabi",
      image:
        "https://res.cloudinary.com/dc6vako2z/image/upload/v1662794253/SushiApp/wasabi-sauce-bowl-isolated-white-background-clipping-path-wasabi-sauce-isolated-white-background-108263059_knpsz1.jpg",
      price: 500,
      type: "other",
    },
  ],
  categories: [
    {
      name: "Promos",
    },
    {
      name: "HandRolls",
    },
  ],
  users: [
    {
      name: "Camilo Valenzuela",
      phone: "+56954275898",
      password: bcrypt.hashSync("123456"),
      role: "admin",
      address: "Alonso de Ercilla 960, Maipú, Chile",
      placeId: "ChIJ8Vm8XDfDYpYRR9toKYfO1NY",
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
      category: "507f191e810c19729de860ea",
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
      category: "507f191e810c19729de860ea",
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
      category: "507f191e810c19729de860ea",
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
      offerPrice: 15990,
      name: "Promo el mar",
      price: 18000,
      lastPrice: 20000,
      quantity: 70,
      unit: "Piezas",
      category: "507f191e810c19729de860ea",
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
      category: "507f191e810c19729de860ea",

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
      category: "507f191e810c19729de860ea",
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
      category: "507f191e810c19729de860ea",
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
      category: "507f191e810c19729de860ea",
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
