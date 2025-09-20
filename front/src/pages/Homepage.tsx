import { Link } from "react-router-dom";

export default function Homepage() {
	return (
		<>
			<div>
				<p className="xl:ml-30 mt-6 text-2xl font-semibold">NOS CATEGORIES</p>

				<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-3 mt-5 2xl:mx-30">
					{/* RAQUETTES */}
					<Link
						to={"/articles/racket"}
						className="relative group bg-[#FFAEC9] aspect-square rounded-2xl flex items-center justify-center  2xl:aspect-auto 2xl:row-start-1 2xl:row-end-3 2xl:col-start-2 2xl:col-end-3  border hover:cursor-pointer overflow-hidden"
					>
						<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
						<img
							src="/categories/racket.avif"
							alt="raquettes"
							className="max-w-full max-h-full object-contain"
						/>
						<p className="absolute text-white text-3xl font-bold hidden group-hover:block z-10">
							RAQUETTES
						</p>
					</Link>

					{/* VETEMENTS */}
					<Link
						to={"/articles/clothing"}
						className="relative group bg-[#B5E51D] aspect-square rounded-2xl flex items-center justify-center 2xl:row-start-1 2xl:row-end-2 2xl:col-start-1 2xl:col-end-2  border hover:cursor-pointer overflow-hidden"
					>
						<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
						<img
							src="/categories/clothing.avif"
							alt="vetements"
							className="max-w-full max-h-full object-contain"
						/>
						<p className="absolute text-white text-3xl font-bold hidden group-hover:block z-10">
							VÊTEMENTS
						</p>
					</Link>

					{/* SACS */}
					<Link
						to={"/articles/bag"}
						className="relative group bg-[#93F7A8] aspect-square 2xl:aspect-[2/1] rounded-2xl flex items-center justify-center 2xl:row-start-1 2xl:row-end-2 2xl:col-start-3 2xl:col-end-5  border hover:cursor-pointer overflow-hidden"
					>
						<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
						<img
							src="/categories/bag.avif"
							alt="sacs"
							className="max-w-full max-h-full object-contain"
						/>
						<p className="absolute text-white text-3xl font-bold hidden group-hover:block z-10">
							SACS
						</p>
					</Link>

					{/* ACCESSOIRES */}
					<Link
						to={"/articles/accessory"}
						className="relative group bg-[#FFD779] aspect-square rounded-2xl flex items-center justify-center 2xl:aspect-auto 2xl:row-start-2 2xl:row-end-4 2xl:col-start-1 2xl:col-end-2  border hover:cursor-pointer overflow-hidden"
					>
						<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
						<img
							src="/categories/accessory.avif"
							alt="accessoires"
							className="max-w-full max-h-full object-contain"
						/>
						<p className="absolute text-white text-3xl font-bold hidden group-hover:block z-10">
							ACCESSOIRES
						</p>
					</Link>

					{/* BALLES */}
					<Link
						to={"/articles/ball"}
						className="relative group bg-[#9AD9EB] aspect-square rounded-2xl flex items-center justify-center 2xl:aspect-auto 2xl:row-start-2 2xl:row-end-3 2xl:col-start-3 2xl:col-end-4  border hover:cursor-pointer overflow-hidden"
					>
						<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
						<img
							src="/categories/ball.avif"
							alt="balles"
							className="max-w-full max-h-full object-contain p-8"
						/>
						<p className="absolute text-white text-3xl font-bold hidden group-hover:block z-10">
							BALLES
						</p>
					</Link>

					{/* CHAUSSURES */}
					<Link
						to={"/articles/shoes"}
						className="relative group bg-[#A3EFD8] aspect-square rounded-2xl flex items-center justify-center 2xl:aspect-auto 2xl:row-start-2 2xl:row-end-4 2xl:col-start-4 2xl:col-end-5  border hover:cursor-pointer overflow-hidden"
					>
						<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
						<img
							src="/categories/shoes.avif"
							alt="chaussures"
							className="max-w-full max-h-full object-contain"
						/>
						<p className="absolute text-white text-3xl font-bold hidden group-hover:block z-10">
							CHAUSSURES
						</p>
					</Link>

					{/* PROMOTIONS */}
					<Link
						to={"/articles/promotion"}
						className="relative col-span-2 xl:col-auto aspect-auto  h-42 xl:h-auto group bg-[#D8DCFF] 2xl:aspect-[2/1] rounded-2xl flex items-center justify-center  2xl:row-start-3 2xl:row-end-4 2xl:col-start-2 2xl:col-end-4  border hover:cursor-pointer overflow-hidden"
					>
						<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
						<img
							src="/categories/promotion.avif"
							alt="promotions"
							className="max-w-full max-h-full object-contain"
						/>
						<p className="absolute text-white text-3xl font-bold hidden group-hover:block z-10">
							PROMOTIONS
						</p>
					</Link>

					{/* <Link
						to={"/articles/promotion"}
						className="relative group bg-[#D8DCFF] aspect-square 2xl:aspect-[2/1] rounded-2xl flex items-center justify-center  2xl:row-start-3 2xl:row-end-4 2xl:col-start-2 2xl:col-end-4  border hover:cursor-pointer overflow-hidden"
					>
						<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
						<img
							src="/categories/promotion.avif"
							alt="promotions"
							className="max-w-full max-h-full object-contain"
						/>
						<p className="absolute text-white text-3xl font-bold hidden group-hover:block z-10">
							PROMOTIONS
						</p>
					</Link> */}
				</div>
			</div>
		</>
	);
}
