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
					className="rounded-md bg-gray-300 w-9 hover:cursor-pointer"
				/>
			</a>
		</>
	);
}
