// validation/registerSchema.ts
import Joi from "joi";

// Schéma le login
export const loginSchema = Joi.object({
	email: Joi.string().email().empty("").required().messages({
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
});
