interface ConfirmModalProps {
	onConfirm: () => void;
	onCancel: () => void;
	message: string;
}

export default function ConfirmModal({
	onConfirm,
	onCancel,
	message,
}: ConfirmModalProps) {
	return (
		<div className="fixed inset-0 bg-gray-200/70 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
				<p className="mb-4">{message}</p>
				<div className="flex justify-around">
					<button
						type="button"
						onClick={onConfirm}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
					>
						Oui
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
					>
						Non
					</button>
				</div>
			</div>
		</div>
	);
}
