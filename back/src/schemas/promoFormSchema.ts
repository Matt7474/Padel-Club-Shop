import Joi from "joi";

export const promoFormSchema = Joi.object({
	name: Joi.string()
		.trim()
		.pattern(/^[A-Za-z0-9À-ÖØ-öø-ÿ'’().,\- \s]{2,100}$/u)
		.required()
		.messages({
			"string.pattern.base": "Le nom contient des caractères non autorisés.",
			"any.required": "Le nom est obligatoire.",
		}),

	description: Joi.string()
		.allow("", null)
		.max(2000)
		.pattern(/^[A-Za-z0-9À-ÖØ-öø-ÿ'’().,\- \s]{2,100}$/u)
		.messages({
			"string.base": "La description doit être une chaîne de caractères.",
			"string.max": "La description est trop longue.",
		}),

	start_date: Joi.date().required().messages({
		"date.base": "La date de début doit être valide.",
		"any.required": "La date de début est obligatoire.",
	}),

	end_date: Joi.date().greater(Joi.ref("start_date")).required().messages({
		"date.base": "La date de fin doit être valide.",
		"date.greater": "La date de fin doit être après la date de début.",
		"any.required": "La date de fin est obligatoire.",
	}),
});
