export type CategoryType = "png" | "vector" | "image";

export interface Category {
  _id: string;
  name: string;
  type: "png" | "vector" | "image";
  active: boolean;
  showInNavbar: boolean;
  createdAt?: Date;
}

export interface GroupedCategories {
  png: Category[];
  vector: Category[];
  image: Category[];
}
