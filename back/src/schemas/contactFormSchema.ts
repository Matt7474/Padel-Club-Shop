import Joi from "joi";

export const contactFormSchema = Joi.object({
	user_id: Joi.number().integer().optional().allow(null),
	first_name: Joi.string().min(1).max(100).required(),
	last_name: Joi.string().min(1).max(100).required(),
	email: Joi.string().email().required(),
	phone: Joi.string().optional().allow(null, ""),
	subject: Joi.string().min(1).max(200).required(),
	order_number: Joi.string().max(20).optional().allow(null, ""),
	message: Joi.string().min(1).max(5000).required(),
});
