// import type { OpenAPIV3 } from "openapi-types";

// export const authPaths: Record<string, OpenAPIV3.PathItemObject> = {
// 	"/user/register": {
// 		post: {
// 			tags: ["Authentication"],
// 			summary: "Créer un nouvel utilisateur",
// 			description:
// 				"Permet à un nouvel utilisateur de s'inscrire avec ses informations personnelles et son adresse de livraison (obligatoire).",
// 			requestBody: {
// 				required: true,
// 				content: {
// 					"application/json": {
// 						schema: {
// 							type: "object",
// 							required: [
// 								"first_name",
// 								"last_name",
// 								"email",
// 								"password",
// 								"shipping_address",
// 							],
// 							properties: {
// 								first_name: { type: "string", example: "John" },
// 								last_name: { type: "string", example: "Doe" },
// 								email: {
// 									type: "string",
// 									format: "email",
// 									example: "john.doe@example.com",
// 								},
// 								password: {
// 									type: "string",
// 									format: "password",
// 									example: "StrongP@ssw0rd",
// 								},
// 								phone: { type: "string", example: "+33612345678" },
// 								shipping_address: {
// 									type: "object",
// 									required: [
// 										"street_number",
// 										"street_name",
// 										"zipcode",
// 										"city",
// 										"country",
// 									],
// 									properties: {
// 										street_number: { type: "string", example: "12B" },
// 										street_name: { type: "string", example: "Avenue du Padel" },
// 										additional_info: { type: "string", example: "App 5" },
// 										zipcode: { type: "string", example: "75008" },
// 										city: { type: "string", example: "Paris" },
// 										country: { type: "string", example: "France" },
// 									},
// 								},
// 								billing_address: {
// 									type: "object",
// 									properties: {
// 										street_number: { type: "string", example: "12B" },
// 										street_name: { type: "string", example: "Avenue du Padel" },
// 										additional_info: { type: "string", example: "App 5" },
// 										zipcode: { type: "string", example: "75008" },
// 										city: { type: "string", example: "Paris" },
// 										country: { type: "string", example: "France" },
// 									},
// 								},
// 							},
// 						},
// 					},
// 				},
// 			},
// 			responses: {
// 				201: {
// 					description: "Utilisateur créé avec succès",
// 					content: {
// 						"application/json": {
// 							schema: {
// 								type: "object",
// 								properties: {
// 									message: {
// 										type: "string",
// 										example: "Utilisateur créé avec succès",
// 									},
// 									user: {
// 										type: "object",
// 										properties: {
// 											id: { type: "number", example: 1 },
// 											first_name: { type: "string", example: "John" },
// 											last_name: { type: "string", example: "Doe" },
// 											email: {
// 												type: "string",
// 												example: "john.doe@example.com",
// 											},
// 											role: { type: "string", example: "client" },
// 										},
// 									},
// 									token: { type: "string", example: "JWT_TOKEN_HERE" },
// 								},
// 							},
// 						},
// 					},
// 				},
// 				400: {
// 					description: "Erreur de validation ou email déjà existant",
// 					content: {
// 						"application/json": {
// 							schema: {
// 								type: "object",
// 								properties: {
// 									error: {
// 										type: "string",
// 										example: "Cette adresse e-mail est déjà enregistrée.",
// 									},
// 								},
// 							},
// 						},
// 					},
// 				},
// 				500: {
// 					description: "Erreur interne du serveur",
// 					content: {
// 						"application/json": {
// 							schema: {
// 								type: "object",
// 								properties: {
// 									error: {
// 										type: "string",
// 										example: "Erreur lors de la création du compte.",
// 									},
// 								},
// 							},
// 						},
// 					},
// 				},
// 			},
// 		},
// 	},

// 	"/user/login": {
// 		post: {
// 			tags: ["Authentication"],
// 			summary: "Connexion d'un utilisateur existant",
// 			description:
// 				"Permet à un utilisateur de se connecter et de recevoir un token JWT.",
// 			requestBody: {
// 				required: true,
// 				content: {
// 					"application/json": {
// 						schema: {
// 							type: "object",
// 							required: ["email", "password"],
// 							properties: {
// 								email: {
// 									type: "string",
// 									format: "email",
// 									example: "john.doe@example.com",
// 								},
// 								password: {
// 									type: "string",
// 									format: "password",
// 									example: "StrongP@ssw0rd",
// 								},
// 							},
// 						},
// 					},
// 				},
// 			},
// 			responses: {
// 				200: {
// 					description: "Connexion réussie",
// 					content: {
// 						"application/json": {
// 							schema: {
// 								type: "object",
// 								properties: {
// 									message: { type: "string", example: "Connexion réussie ✅" },
// 									user: {
// 										type: "object",
// 										properties: {
// 											id: { type: "number", example: 1 },
// 											first_name: { type: "string", example: "John" },
// 											last_name: { type: "string", example: "Doe" },
// 											email: {
// 												type: "string",
// 												example: "john.doe@example.com",
// 											},
// 											phone: { type: "string", example: "+33612345678" },
// 											role: { type: "string", example: "client" },
// 										},
// 									},
// 									token: { type: "string", example: "JWT_TOKEN_HERE" },
// 								},
// 							},
// 						},
// 					},
// 				},
// 				400: { description: "Email non trouvé" },
// 				401: { description: "Mot de passe incorrect" },
// 				500: { description: "Erreur interne du serveur" },
// 			},
// 		},
// 	},
// };
