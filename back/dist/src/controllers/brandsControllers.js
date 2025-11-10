"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBrand = createBrand;
exports.getAllBrands = getAllBrands;
exports.updateBrand = updateBrand;
exports.deleteBrand = deleteBrand;
const brand_1 = require("../models/brand");
const brandsFormSchema_1 = require("../schemas/brandsFormSchema");
const sanitize_1 = require("../utils/sanitize");
async function createBrand(req, res) {
    try {
        const { error, value } = brandsFormSchema_1.brandsFormSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const messages = error.details.map((d) => d.message);
            return res.status(400).json({ errors: messages });
        }
        let brandName = value.brandName;
        let imagePath;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }
        else if (value.image_url) {
            imagePath = value.image_url;
        }
        else {
            return res.status(400).json({ error: "Aucune image fournie" });
        }
        brandName = (0, sanitize_1.sanitizeInput)(brandName);
        const brand = await brand_1.Brand.create({
            name: brandName,
            logo: imagePath,
        });
        res.status(201).json(brand);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getAllBrands(_req, res) {
    try {
        const brands = await brand_1.Brand.findAll();
        res.json(brands);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function updateBrand(req, res) {
    try {
        const { id } = req.params;
        const { name, logo } = req.body;
        if (!id) {
            return res.status(400).json({ error: "ID manquant" });
        }
        const [updated] = await brand_1.Brand.update({ name, logo }, { where: { brand_id: id } });
        if (updated === 0) {
            return res.status(404).json({ error: "Marque non trouvée" });
        }
        res.json({ message: "✅ Marque modifiée avec succès" });
    }
    catch (err) {
        console.error("❌ Erreur updateBrand :", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function deleteBrand(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID manquant" });
        }
        const deleted = await brand_1.Brand.destroy({
            where: { brand_id: id },
        });
        if (deleted === 0) {
            return res.status(404).json({ error: "Marque non trouvée" });
        }
        res.json({ message: "✅ Marque supprimée avec succès" });
    }
    catch (err) {
        console.error("❌ Erreur deleteBrand :", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
