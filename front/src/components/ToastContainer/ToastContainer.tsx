import { useToastStore } from "../../store/ToastStore ";
import InfoModal from "../Modal/InfoModal";

export default function ToastContainer() {
	const { toasts, removeToast } = useToastStore();

	return (
		<div className="fixed bottom-5 left-5 flex flex-col gap-2 z-100">
			{toasts.map((toast) => (
				<InfoModal
					key={toast.id}
					id={toast.id}
					bg={toast.bg}
					text={toast.text}
					duration={toast.duration}
					onClose={removeToast}
				/>
			))}
		</div>
	);
}
