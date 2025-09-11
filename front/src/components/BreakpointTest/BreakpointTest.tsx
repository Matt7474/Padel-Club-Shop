export default function BreakpointTest() {
	return (
		<div
			className="p-6 text-white text-lg font-bold
    bg-blue-500 sm:bg-green-500 md:bg-yellow-500 lg:bg-red-500 xl:bg-purple-500 2xl:bg-pink-500 3xl:!bg-cyan-500 4xl:!bg-orange-500"
		>
			<p className="block sm:hidden">
				📱 &lt; 640px → Mobile (base) → bg-blue-500 / Mobile
			</p>
			<p className="hidden sm:block md:hidden">
				📱 640px à 767px → Small (sm) → bg-green-500 / Petits écrans (tablette
				portrait)
			</p>
			<p className="hidden md:block lg:hidden">
				💻 768px à 1023px → Medium (md) → bg-yellow-500 / Tablettes & petits
				laptops
			</p>
			<p className="hidden lg:block xl:hidden">
				🖥️ 1024px à 1279px → Large (lg) → bg-red-500 / Laptops classiques
			</p>
			<p className="hidden xl:block 2xl:hidden">
				🖥️ 1280px à 1535px → Extra Large (xl) → bg-purple-500 / Grands écrans
			</p>
			<p className="hidden 2xl:block 3xl:!hidden">
				🖥️ 1536px à 2499px → 2XL → bg-pink-500 / Très grands écrans
			</p>
			<p className="hidden 3xl:block">
				🖥️ 2500px et + → 3XL → bg-cyan-500 / Ultra-larges écrans (2k)
			</p>
		</div>
	);
}
