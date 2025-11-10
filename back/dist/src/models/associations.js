"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adress_1 = require("./adress");
const article_1 = require("./article");
const articleImage_1 = require("./articleImage");
const articleRatings_1 = require("./articleRatings");
const brand_1 = require("./brand");
const contactMessage_1 = require("./contactMessage");
const message_1 = require("./message");
const order_1 = require("./order");
const orderItem_1 = require("./orderItem");
const promotions_1 = require("./promotions");
const role_1 = require("./role");
const user_1 = require("./user");
// Article -> Brand
article_1.Article.belongsTo(brand_1.Brand, { as: "brand", foreignKey: "brand_id" });
brand_1.Brand.hasMany(article_1.Article, { as: "articles", foreignKey: "brand_id" });
// Article -> Promotion
article_1.Article.hasMany(promotions_1.Promotions, { as: "promotions", foreignKey: "article_id" });
promotions_1.Promotions.belongsTo(article_1.Article, { foreignKey: "article_id" });
// Article -> ArticleImage
article_1.Article.hasMany(articleImage_1.ArticleImage, { as: "images", foreignKey: "article_id" });
articleImage_1.ArticleImage.belongsTo(article_1.Article, { foreignKey: "article_id" });
// Article -> ArticleRatings
article_1.Article.hasOne(articleRatings_1.ArticleRatings, { as: "ratings", foreignKey: "article_id" });
articleRatings_1.ArticleRatings.belongsTo(article_1.Article, { foreignKey: "article_id" });
// Role -> User
role_1.Role.hasMany(user_1.User, { foreignKey: "role_id" });
user_1.User.belongsTo(role_1.Role, { foreignKey: "role_id" });
// User -> Address
user_1.User.hasMany(adress_1.Address, { as: "addresses", foreignKey: "user_id" });
adress_1.Address.belongsTo(user_1.User, { foreignKey: "user_id" });
// User -> Order
user_1.User.hasMany(order_1.Order, { as: "orders", foreignKey: "user_id" });
order_1.Order.belongsTo(user_1.User, { as: "user", foreignKey: "user_id" });
// Order -> OrderItem
order_1.Order.hasMany(orderItem_1.OrderItem, { as: "items", foreignKey: "order_id" });
orderItem_1.OrderItem.belongsTo(order_1.Order, { foreignKey: "order_id" });
// Article -> OrderItem
article_1.Article.hasMany(orderItem_1.OrderItem, { as: "orderItems", foreignKey: "article_id" });
orderItem_1.OrderItem.belongsTo(article_1.Article, { as: "article", foreignKey: "article_id" });
// User -> Contact
user_1.User.hasMany(contactMessage_1.ContactMessage, { as: "contacts", foreignKey: "user_id" });
contactMessage_1.ContactMessage.belongsTo(user_1.User, {
    foreignKey: "email",
    targetKey: "email",
    as: "user",
});
// Message -> User
message_1.Message.belongsTo(user_1.User, {
    as: "sender",
    foreignKey: "sender_id",
    targetKey: "user_id",
});
// Message -> User
message_1.Message.belongsTo(user_1.User, {
    as: "receiver",
    foreignKey: "receiver_id",
    targetKey: "user_id",
});
user_1.User.hasMany(contactMessage_1.ContactMessage, { as: "contactMessages", foreignKey: "user_id" });
contactMessage_1.ContactMessage.belongsTo(user_1.User, {
    as: "contactUser", // <-- changer l'alias
    foreignKey: "user_id",
    targetKey: "user_id",
});
