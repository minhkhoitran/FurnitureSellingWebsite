import React from "react";
import { GiCompass, GiDiamondHard, GiStabbedNote } from "react-icons/gi";
export const links = [
  {
    id: 1,
    text: "Trang chủ",
    url: "/",
  },
  {
    id: 2,
    text: "về chúng tôi",
    url: "/VeChungToi",
  },
  {
    id: 3,
    text: "sản phẩm",
    url: "/SanPham",
  },
];

export const services = [
  {
    id: 1,
    icon: <GiCompass />,
    title: "Nhiệm vụ",
    text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, ea. Perferendis corrupti reiciendis nesciunt rerum velit autem unde numquam nisi",
  },
  {
    id: 2,
    icon: <GiDiamondHard />,
    title: "Tầm nhìn",
    text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, ea. Perferendis corrupti reiciendis nesciunt rerum velit autem unde numquam nisi",
  },
  {
    id: 3,
    icon: <GiStabbedNote />,
    title: "Lịch sử",
    text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, ea. Perferendis corrupti reiciendis nesciunt rerum velit autem unde numquam nisi",
  },
];

export const products_url = "http://127.0.0.1:8000/SanPham/";

