import { useCartStore } from "../../store/cartStore";

export default function ProductCard({ product }: any) {
	const { addToCart } = useCartStore();

	return (
		<div className="border p-4 rounded-lg">
			<img src={product.image} alt={product.name} className="w-40 h-40" />
			<h2 className="text-lg font-bold">{product.name}</h2>
			<p>{product.price} €</p>
			<button
				type="button"
				onClick={() => addToCart({ ...product, quantity: 1 })}
				className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
			>
				Ajouter au panier
			</button>
		</div>
	);
}
