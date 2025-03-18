export type FruitResult = {
  quantity: string;
  fruit_name: string;
};

export type ImageData = {
  img_id: string;
  image_url: string;
  results: FruitResult[];
};

export type Activity = {
  id_historique: string;
  description: string;
  nbre_total_img: number;
  date_televersement: string;
  id_utilisateur: string;
  images: ImageData[];
};
