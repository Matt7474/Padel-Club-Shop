/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import { useRef, useState } from "react";

interface ZoomImageProps {
	src: string;
	alt?: string;
	zoom?: number; // niveau de zoom
	size?: number; // taille de la loupe en px
	shape?: "circle" | "square";
}

export default function ZoomImage({
	src,
	alt = "",
	zoom = 3,
	size = 150,
	shape = "circle",
}: ZoomImageProps) {
	const imgRef = useRef<HTMLImageElement>(null);
	const [lensPos, setLensPos] = useState<{ x: number; y: number } | null>(null);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!imgRef.current) return;
		const rect = imgRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		setLensPos({ x, y });
	};

	const handleMouseLeave = () => {
		setLensPos(null);
	};

	return (
		<div
			className="relative w-full aspect-square border border-gray-300 rounded-sm overflow-hidden"
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			{/* Image de base */}
			<img
				ref={imgRef}
				src={src}
				alt={alt}
				className="w-full h-full object-cover"
			/>

			{/* Loupe */}
			{lensPos && (
				<div
					className="absolute pointer-events-none border-2 border-white shadow-lg"
					style={{
						top: lensPos.y - size / 2,
						left: lensPos.x - size / 2,
						width: size,
						height: size,
						borderRadius: shape === "circle" ? "50%" : "0%",
						backgroundImage: `url(${src})`,
						backgroundRepeat: "no-repeat",
						backgroundSize: `${imgRef.current?.width! * zoom}px ${
							imgRef.current?.height! * zoom
						}px`,
						backgroundPosition: `-${lensPos.x * zoom - size / 2}px -${
							lensPos.y * zoom - size / 2
						}px`,
					}}
				/>
			)}
		</div>
	);
}
