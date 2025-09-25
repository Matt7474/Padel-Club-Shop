import { Article } from "./article";
import { ArticleImage } from "./articleImage";
import { ArticleRatings } from "./articleRatings";
import { Brand } from "./brand";
import { Promotion } from "./promotion";

// Article -> Brand
Article.belongsTo(Brand, { as: "brand", foreignKey: "brand_id" });
Brand.hasMany(Article, { as: "articles", foreignKey: "brand_id" });

// Article -> Promotion
Article.hasMany(Promotion, { as: "promotions", foreignKey: "article_id" });
Promotion.belongsTo(Article, { foreignKey: "article_id" });

// Article -> ArticleImage
Article.hasMany(ArticleImage, { as: "images", foreignKey: "article_id" });
ArticleImage.belongsTo(Article, { foreignKey: "article_id" });

// Article -> ArticleRatings
Article.hasOne(ArticleRatings, { as: "ratings", foreignKey: "article_id" });
ArticleRatings.belongsTo(Article, { foreignKey: "article_id" });
