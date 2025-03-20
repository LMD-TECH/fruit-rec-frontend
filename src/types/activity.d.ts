export type FruitResult = {
  quantity: string;
  fruit_name: string;
};

export type ImageData = {
  img_id: string;
  image_url: string;
  fruits: FruitResult[];
};

export type Historique = {
  id_historique: string;
  description: string;
  nbre_total_img: number;
  date_televersement: string;
  id_utilisateur: string;
  images: ImageData[];
};

export type Statistique = {
  total_images: number;
  total_fruits: number;
  moyenne_fruits_images: number;
};

export type Activity = {
  histories: Historique[];
  stats: Statistique;
};
