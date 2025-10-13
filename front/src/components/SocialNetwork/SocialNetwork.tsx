interface SocialNetworkProps {
	name: string;
	link: string;
}

export default function SocialNetwork({ name, link }: SocialNetworkProps) {
	return (
		<>
			<a href={link} target="_blank" rel="noopener noreferrer">
				<img
					src={`/icons/${name}.svg`}
					alt={`logo ${name}`}
					className="rounded-md bg-white w-9 cursor-pointer"
				/>
			</a>
		</>
	);
}
