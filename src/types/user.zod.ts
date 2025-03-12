import { z } from "zod";

const User_Shema = z.object({
  nom_famille: z
    .string({ message: "Le nom de famille de l'utilisateur" })
    .min(1, { message: "Le nom de famille est requis" }),
  prenom: z
    .string({ message: "Le prénom de l'utilisateur" })
    .min(1, { message: "Le prénom est requis" }),
  email: z
    .string({ message: "L'adresse email du user" })
    .email("L'e-mail invalide !"),
  numero_telephone: z
    .string({ message: "Le numéro de tel" })
    .regex(/^\+?\d{1,4}[-\s]?\(?\d{1,4}\)?[-\s]?\d{6,15}$/),
  mot_de_passe: z
    .string()
    .min(5, { message: "Mot de passe : mIn 5 carac" })
    .nullable()
    .optional(),
  photo_profile: z.any().nullable(),
});

type _User = z.infer<typeof User_Shema>;

export { type _User, User_Shema };
