import { Address } from "./adress";
import { Article } from "./article";
import { ArticleImage } from "./articleImage";
import { ArticleRatings } from "./articleRatings";
import { Brand } from "./brand";
import ContactMessage from "./contactMessage";
import { Conversation } from "./conversation";
import { ConversationUser } from "./conversationUser";
import { Message } from "./message";
import { Order } from "./order";
import { OrderItem } from "./orderItem";
import { Promotions } from "./promotions";
import { Role } from "./role";
import { User } from "./user";

// Article -> Brand
Article.belongsTo(Brand, { as: "brand", foreignKey: "brand_id" });
Brand.hasMany(Article, { as: "articles", foreignKey: "brand_id" });

// Article -> Promotion
Article.hasMany(Promotions, { as: "promotions", foreignKey: "article_id" });
Promotions.belongsTo(Article, { foreignKey: "article_id" });

// Article -> ArticleImage
Article.hasMany(ArticleImage, { as: "images", foreignKey: "article_id" });
ArticleImage.belongsTo(Article, { foreignKey: "article_id" });

// Article -> ArticleRatings
Article.hasOne(ArticleRatings, { as: "ratings", foreignKey: "article_id" });
ArticleRatings.belongsTo(Article, { foreignKey: "article_id" });

// Role -> User
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

// User -> Address
User.hasMany(Address, { as: "addresses", foreignKey: "user_id" });
Address.belongsTo(User, { foreignKey: "user_id" });

// User -> Order
User.hasMany(Order, { as: "orders", foreignKey: "user_id" });
Order.belongsTo(User, { as: "user", foreignKey: "user_id" });

// Order -> OrderItem
Order.hasMany(OrderItem, { as: "items", foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// Article -> OrderItem
Article.hasMany(OrderItem, { as: "orderItems", foreignKey: "article_id" });
OrderItem.belongsTo(Article, { as: "article", foreignKey: "article_id" });

// User -> Contact
User.hasMany(ContactMessage, { as: "contacts", foreignKey: "user_id" });
ContactMessage.belongsTo(User, {
	foreignKey: "email",
	targetKey: "email",
	as: "user",
});

// conversation -> message
Conversation.hasMany(Message, {
	foreignKey: "conversation_id",
	as: "messages",
});
Message.belongsTo(Conversation, {
	foreignKey: "conversation_id",
	as: "conversation",
});

// conversation -> user
Conversation.belongsToMany(User, {
	through: ConversationUser,
	foreignKey: "conversation_id",
	otherKey: "user_id",
	as: "users",
});

User.belongsToMany(Conversation, {
	through: ConversationUser,
	foreignKey: "user_id",
	otherKey: "conversation_id",
	as: "conversations",
});
