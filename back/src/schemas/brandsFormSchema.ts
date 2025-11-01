import Joi from "joi";

export const brandsFormSchema = Joi.object({
	brandName: Joi.string()
		.trim()
		.pattern(/^[A-Za-z0-9À-ÖØ-öø-ÿ'’().,\- \s]{2,100}$/u)
		.required()
		.messages({
			"string.pattern.base":
				"Le nom ne doit contenir que des lettres, chiffres, espaces et ponctuation basique (.,-'()).",
			"any.required": "Le nom de la marque est obligatoire.",
		}),
	image_url: Joi.string()
		.uri({ scheme: ["http", "https"] })
		.allow("", null)
		.messages({
			"string.uri": "L'URL de l'image doit être valide.",
		}),
});
