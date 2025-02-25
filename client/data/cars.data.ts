import { Car } from "@/interfaces/car.interfaces";

export const cars: Car[] = [
  {
    _id: "1",
    make: "Toyota",
    model: "Camry",
    manufactureYear: 2024,
    price: 40000,
    imageUrl:
      "https://scene7.toyota.eu/is/image/toyotaeurope/CAMRY_PR_34Front_F3D_v11_WEB:Medium-Landscape?ts=0&resMode=sharp2&op_usm=1.75,0.3,2,0",
  },
  {
    _id: "2",
    make: "Ford",
    model: "Mustang",
    manufactureYear: 2023,
    price: 80000,
    imageUrl:
      "https://static.overfuel.com/dealers/trust-auto/image/2020-ford-mustang-shelby-gt350-heritage-edition-3-1024x640.jpg",
  },
  {
    _id: "3",
    make: "Tesla",
    model: "Model 3",
    manufactureYear: 2022,
    price: 45000,
    imageUrl: "",
  },
  {
    _id: "4",
    make: "Porsche",
    model: "991",
    manufactureYear: 2024,
    price: 120000,
    imageUrl:
      "https://media.autoexpress.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1685458010/autoexpress/2023/05/Porsche%20911%20GTS%20UK%20001_otx6j7.jpg",
  },
];
