export type CategoryType = "png" | "vector" | "image";

export interface Category {
  _id: string;
  name: string;
  type: CategoryType;
  active: boolean;
  showInNavbar: boolean;
}

export interface GroupedCategories {
  png: Category[];
  vector: Category[];
  image: Category[];
}
