import jsPDF from "jspdf";
import type { OrderItem } from "../types/Order";

interface InvoiceData {
	order_id: number;
	reference: string;
	total_amount: number;
	created_at: string;
	items: OrderItem[];
	user: {
		firstName?: string;
		lastName?: string;
		email?: string;
		addresses?: Array<{
			street_number?: string;
			street_name?: string;
			zip_code?: string;
			city?: string;
			country?: string;
		}>;
	};
}

export const generateInvoice = (orderData: InvoiceData) => {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();
	let yPos = 20;

	// ===== En-tête =====
	doc.setFontSize(24);
	doc.setTextColor(79, 70, 229);
	doc.text("FACTURE", pageWidth / 2, yPos, { align: "center" });

	yPos += 15;
	doc.setFontSize(10);
	doc.setTextColor(100, 100, 100);
	doc.text("Padel Club Shop", pageWidth - 20, yPos, { align: "right" });
	yPos += 5;
	doc.text("123 Avenue du Padel", pageWidth - 20, yPos, { align: "right" });
	yPos += 5;
	doc.text("34370 Cazouls-lès-Béziers, France", pageWidth - 20, yPos, {
		align: "right",
	});
	yPos += 5;
	doc.text("dimier.matt.dev@gmail.com", pageWidth - 20, yPos, {
		align: "right",
	});

	// ===== Référence & date =====
	yPos += 15;
	doc.setFontSize(11);
	doc.setTextColor(0, 0, 0);
	doc.setFont("helvetica", "bold");
	doc.text(`N° de facture : ${orderData.reference || "N/A"}`, 20, yPos);
	yPos += 7;
	doc.setFont("helvetica", "normal");

	const orderDate = orderData.created_at
		? new Date(orderData.created_at).toLocaleDateString("fr-FR", {
				day: "numeric",
				month: "long",
				year: "numeric",
			})
		: "Date non disponible";
	doc.text(`Date : ${orderDate}`, 20, yPos);

	// ===== Informations client =====
	yPos += 15;

	let addressLines = 1;
	if (orderData.user?.addresses?.length) {
		const addr = orderData.user.addresses[0];
		if (addr.street_number || addr.street_name) addressLines++;
		if (addr.zip_code || addr.city) addressLines++;
		if (addr.country) addressLines++;
	}
	const blockHeight = 10 + addressLines * 5;
	doc.setFillColor(249, 250, 251);
	doc.rect(20, yPos - 5, pageWidth - 40, blockHeight, "F");

	doc.setFont("helvetica", "bold");
	doc.text("Facturation à :", 25, yPos);
	yPos += 7;
	doc.setFont("helvetica", "normal");

	const fullName =
		`${orderData.user?.lastName || ""} ${orderData.user?.firstName || ""}`.trim() ||
		"Client";
	doc.text(fullName, 25, yPos);

	if (orderData.user?.addresses?.length) {
		const addr = orderData.user.addresses[0];
		if (addr.street_number || addr.street_name) {
			yPos += 5;
			doc.text(
				`${addr.street_number || ""} ${addr.street_name || ""}`.trim(),
				25,
				yPos,
			);
		}
		if (addr.zip_code || addr.city) {
			yPos += 5;
			doc.text(`${addr.zip_code || ""} ${addr.city || ""}`.trim(), 25, yPos);
		}
		if (addr.country) {
			yPos += 5;
			doc.text(addr.country, 25, yPos);
		}
	}

	// ===== Tableau des articles =====
	yPos += 15;
	doc.setFont("helvetica", "bold");
	doc.setFillColor(79, 70, 229);
	doc.setTextColor(255, 255, 255);
	doc.rect(20, yPos - 5, pageWidth - 40, 10, "F");
	doc.text("Article", 25, yPos);
	doc.text("Taille", pageWidth - 90, yPos);
	doc.text("Qté", pageWidth - 60, yPos);
	doc.text("Prix unitaire", pageWidth - 23, yPos, { align: "right" });

	yPos += 10;
	doc.setTextColor(0, 0, 0);
	doc.setFont("helvetica", "normal");

	let subtotalHT = 0;

	orderData.items.forEach((item, index) => {
		const pricePaid = Number(item.price);
		const quantity = Number(item.quantity);
		const priceHT = pricePaid / 1.2;
		subtotalHT += priceHT * quantity;

		// Ligne grise alternée
		if (index % 2 === 0) {
			doc.setFillColor(249, 250, 251);
			doc.rect(20, yPos - 5, pageWidth - 40, 8, "F");
		}

		const articleName = item.article?.name || item.name || "Article";
		doc.text(articleName, 25, yPos);
		doc.text(item.size || "-", pageWidth - 90, yPos);
		doc.text(quantity.toString(), pageWidth - 60, yPos);

		// Si prix payé < prix catalogue, afficher barre prix catalogue
		const catalogPrice = item.article?.price_ttc
			? Number(item.article.price_ttc)
			: null;
		if (catalogPrice && pricePaid < catalogPrice) {
			// Prix catalogue barré
			doc.setFontSize(9);
			doc.setTextColor(150, 150, 150);
			doc.text(`${catalogPrice.toFixed(2)} €`, pageWidth - 25, yPos - 2, {
				align: "right",
			});
			const textWidth = doc.getTextWidth(`${catalogPrice.toFixed(2)} €`);
			doc.setDrawColor(150, 150, 150);
			doc.line(pageWidth - 25 - textWidth, yPos - 3, pageWidth - 25, yPos - 3);

			// Prix payé en rouge
			doc.setFontSize(10);
			doc.setTextColor(255, 0, 0);
			doc.text(`${pricePaid.toFixed(2)} €`, pageWidth - 25, yPos + 3, {
				align: "right",
			});
			doc.setTextColor(0, 0, 0);
		} else {
			// Prix normal
			doc.text(`${pricePaid.toFixed(2)} €`, pageWidth - 25, yPos, {
				align: "right",
			});
		}

		yPos += 8;
	});

	// ===== Totaux =====
	yPos += 10;
	doc.setDrawColor(200, 200, 200);
	doc.line(20, yPos, pageWidth - 20, yPos);

	yPos += 8;
	doc.text("Sous-total HT :", pageWidth - 70, yPos);
	doc.text(`${subtotalHT.toFixed(2)} €`, pageWidth - 25, yPos, {
		align: "right",
	});

	yPos += 7;
	const tva = subtotalHT * 0.2;
	doc.text("TVA (20%) :", pageWidth - 70, yPos);
	doc.text(`${tva.toFixed(2)} €`, pageWidth - 25, yPos, { align: "right" });

	yPos += 7;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(12);
	doc.text("Total TTC :", pageWidth - 70, yPos);
	doc.text(
		`${Number(orderData.total_amount).toFixed(2)} €`,
		pageWidth - 25,
		yPos,
		{ align: "right" },
	);

	// ===== Pied de page =====
	yPos += 20;
	doc.setFontSize(9);
	doc.setFont("helvetica", "normal");
	doc.setTextColor(100, 100, 100);
	doc.text("Merci pour votre commande !", pageWidth / 2, yPos, {
		align: "center",
	});

	yPos += 5;
	doc.text(
		"En cas de questions, contactez-nous à dimier.matt.dev@gmail.com",
		pageWidth / 2,
		yPos,
		{ align: "center" },
	);

	// Générer et télécharger le PDF
	const fileName = `Facture_${orderData.reference || orderData.order_id || "commande"}.pdf`;
	doc.save(fileName);
};
