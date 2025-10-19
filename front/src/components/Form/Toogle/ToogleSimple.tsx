type ToggleProps = {
	checked: boolean;
	onChange: (value: boolean) => void;
};

export default function ToggleSimple({ checked, onChange }: ToggleProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			onClick={() => onChange(!checked)}
			className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
				${checked ? "bg-blue-500" : "bg-gray-300"}
				focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
		>
			<span
				className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform
					${checked ? "translate-x-5" : "translate-x-1"}`}
			/>
		</button>
	);
}
