// validation/registerSchema.ts
import Joi from "joi";

// Schéma pour les adresses (shipping et billing)
const addressSchema = Joi.object({
	street_number: Joi.string()
		.min(1)
		.max(10)
		// chiffres, lettres, '/', '-', 'bis', 'ter' etc. autorisés
		.pattern(/^[0-9A-Za-zÀ-ÖØ-öø-ÿ'’\-/\s]{1,10}$/u)
		.required()
		.messages({
			"string.pattern.base":
				"Le numéro de rue ne doit contenir que des lettres, chiffres, espaces, '/', '-' ou apostrophes.",
			"string.min": "Le numéro de rue doit contenir au moins 1 caractère.",
			"string.max": "Le numéro de rue ne doit pas dépasser 10 caractères.",
			"any.required": "Le champ street_number est obligatoire.",
		}),

	street_name: Joi.string()
		.min(2)
		.max(100)
		// noms de rues autorisant lettres, chiffres, espaces, ., , ' - ()
		.pattern(/^[A-Za-z0-9À-ÖØ-öø-ÿ'’().,\- \s]{2,100}$/u)
		.required()
		.messages({
			"string.pattern.base": "Le nom de rue contient des caractères invalides.",
			"string.min": "Le nom de rue doit contenir au moins 2 caractères.",
			"string.max": "Le nom de rue ne doit pas dépasser 100 caractères.",
			"any.required": "Le champ street_name est obligatoire.",
		}),

	additional_info: Joi.string()
		.max(200)
		.pattern(/^[^<>]*$/)
		.allow("", null)
		.messages({
			"string.max":
				"Le complément d'adresse ne doit pas dépasser 200 caractères.",
			"string.pattern.base":
				"Le complément d'adresse ne peut pas contenir de balises HTML ou de caractères spéciaux (<, >).",
		}),

	zipcode: Joi.string()
		.min(3)
		.max(10)
		// accepte chiffres, lettres, espaces, tirets (cover FR/INT)
		.pattern(/^[A-Za-z0-9 -]{3,10}$/)
		.required()
		.messages({
			"string.pattern.base":
				"Le code postal contient des caractères invalides.",
			"string.min": "Le code postal doit contenir au moins 3 caractères.",
			"string.max": "Le code postal ne doit pas dépasser 10 caractères.",
			"any.required": "Le champ zipcode est obligatoire.",
		}),

	city: Joi.string()
		.min(2)
		.max(50)
		.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ'’\-\s]{2,50}$/u)
		.required()
		.messages({
			"string.pattern.base":
				"La ville ne doit contenir que des lettres, tirets ou apostrophes.",
			"string.min": "La ville doit contenir au moins 2 caractères.",
			"string.max": "La ville ne doit pas dépasser 50 caractères.",
			"any.required": "Le champ city est obligatoire.",
		}),

	country: Joi.string()
		.min(2)
		.max(50)
		.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ'’\-\s]{2,50}$/u)
		.required()
		.messages({
			"string.pattern.base":
				"Le pays ne doit contenir que des lettres, tirets ou apostrophes.",
			"string.min": "Le pays doit contenir au moins 2 caractères.",
			"string.max": "Le pays ne doit pas dépasser 50 caractères.",
			"any.required": "Le champ country est obligatoire.",
		}),
});

export const registerSchema = Joi.object({
	first_name: Joi.string()
		.min(2)
		.max(30)
		.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ'’-]+$/u)
		.required()
		.messages({
			"string.pattern.base":
				"Le prénom ne doit contenir que des lettres, tirets ou apostrophes.",
			"string.min": "Le prénom doit contenir au moins 2 caractères.",
			"string.max": "Le prénom ne doit pas dépasser 30 caractères.",
			"any.required": "Le champ prénom est obligatoire.",
		}),
	last_name: Joi.string()
		.min(2)
		.max(30)
		.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ'’-]+$/u)
		.required()
		.messages({
			"string.pattern.base":
				"Le nom ne doit contenir que des lettres, tirets ou apostrophes.",
			"string.min": "Le nom doit contenir au moins 2 caractères.",
			"string.max": "Le nom ne doit pas dépasser 30 caractères.",
			"any.required": "Le champ nom est obligatoire.",
		}),
	phone: Joi.string()
		.pattern(/^[0-9+(). -]*$/)
		.optional()
		.allow("", null)
		.messages({
			"string.pattern.base":
				"Le téléphone ne doit contenir que chiffres, espaces, +, (), . ou -.",
		}),
	email: Joi.string().email().required().empty("").messages({
		"string.email": "Le format de l'email est invalide.",
		"any.required": "Le champ email est obligatoire.",
		"string.empty": "Le champ email est obligatoire.",
	}),
	password: Joi.string()
		.pattern(/^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9\-!@#$%^&*()_+=]{8,}$/)
		.required()
		.empty("")
		.messages({
			"string.pattern.base":
				"Le mot de passe doit contenir au moins 8 caractères, dont 1 chiffre et 1 majuscule.",
			"any.required": "Le champ password est obligatoire.",
			"string.empty": "Le champ password est obligatoire.",
		}),
	shipping_address: addressSchema.optional().allow(null),
	billing_address: addressSchema.optional().allow(null),
});
