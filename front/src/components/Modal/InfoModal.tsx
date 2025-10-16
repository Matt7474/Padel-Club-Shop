// components/InfoModal.tsx
import { useEffect, useState } from "react";

interface ToastProps {
	id: number;
	bg: string;
	text: string;
	onClose: (id: number) => void;
	duration?: number;
}

export default function InfoModal({
	id,
	bg,
	text,
	onClose,
	duration = 3000,
}: ToastProps) {
	const [animationState, setAnimationState] = useState<
		"entering" | "visible" | "exiting"
	>("entering");

	useEffect(() => {
		const enterTimer = setTimeout(() => setAnimationState("visible"), 10);
		const exitTimer = setTimeout(() => {
			setAnimationState("exiting");
			setTimeout(() => onClose(id), 300);
		}, duration);
		return () => {
			clearTimeout(enterTimer);
			clearTimeout(exitTimer);
		};
	}, [id, duration, onClose]);

	const getTransformClass = () => {
		switch (animationState) {
			case "entering":
				return "-translate-x-full opacity-0";
			case "visible":
				return "translate-x-0 opacity-100";
			case "exiting":
				return "-translate-x-full opacity-0";
			default:
				return "-translate-x-full opacity-0";
		}
	};

	return (
		<div
			className={`${bg} px-4 py-2 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ease-in-out ${getTransformClass()}`}
		>
			<p>{text}</p>
		</div>
	);
}

// import { useEffect, useState } from "react";

// interface ToastProps {
// 	id: number;
// 	bg: string;
// 	text: string;
// 	onClose: (id: number) => void;
// 	duration?: number;
// }

// export default function InfoModal({
// 	id,
// 	bg,
// 	text,
// 	onClose,
// 	duration = 3000,
// }: ToastProps) {
// 	const [animationState, setAnimationState] = useState<
// 		"entering" | "visible" | "exiting"
// 	>("entering");

// 	useEffect(() => {
// 		// Animation d'entrée
// 		const enterTimer = setTimeout(() => {
// 			setAnimationState("visible");
// 		}, 10);

// 		// Lance la sortie après duration
// 		const exitTimer = setTimeout(() => {
// 			setAnimationState("exiting");

// 			// Attend la fin de l'animation de sortie avant suppression
// 			setTimeout(() => onClose(id), 300);
// 		}, duration);

// 		return () => {
// 			clearTimeout(enterTimer);
// 			clearTimeout(exitTimer);
// 		};
// 	}, [id, duration, onClose]);

// 	const getTransformClass = () => {
// 		switch (animationState) {
// 			case "entering":
// 				return "-translate-x-full opacity-0"; // arrive de la gauche
// 			case "visible":
// 				return "translate-x-0 opacity-100"; // visible au centre
// 			case "exiting":
// 				return "-translate-x-full opacity-0"; // repart vers la gauche
// 			default:
// 				return "-translate-x-full opacity-0";
// 		}
// 	};

// 	return (
// 		<div
// 			className={
// 				`${bg} absolute left-0 -bottom-10 px-4 py-2 rounded-lg shadow-lg text-white font-semibold ` +
// 				"transition-all duration-300 ease-in-out " +
// 				getTransformClass()
// 			}
// 		>
// 			<p>{text}</p>
// 		</div>
// 	);
// }
