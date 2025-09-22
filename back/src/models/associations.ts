import { Article } from "./Article";
import { Brand } from "./Brand";

Article.belongsTo(Brand, { foreignKey: "brand_id", as: "brand" });
Brand.hasMany(Article, { foreignKey: "brand_id", as: "articles" });
