import { Link } from "react-router-dom";

interface LinkMenuProps {
	to: string;
	name: string;
	color: string;
	border: number;
	marginLeft?: number;
	animate?: string;
	onLinkClick?: () => void;
}

export default function LinkMenu({
	to,
	name,
	color,
	border,
	marginLeft,
	animate,
	onLinkClick,
}: LinkMenuProps) {
	const handleClick = () => {
		if (onLinkClick) {
			onLinkClick();
		}
	};
	return (
		<>
			<div>
				<Link
					to={`/articles/${to}`}
					className={`border-b-${border} border-gray-300 -mt-3 py-3 pl-3 hover:cursor-pointer ${animate} hover:bg-gray-300 flex justify-between ${color} font-semibold flex w-[110%]`}
					onClick={handleClick}
				>
					{name}
					<img
						src="/icons/arrow.svg"
						alt="fleche"
						className={`w-4 pt-0.5 mr-3 ml-${marginLeft}`}
					/>
				</Link>
			</div>
		</>
	);
}
