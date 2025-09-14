import { useParams } from "react-router-dom";
import Articles from "../../pages/Articles";

export default function ArticlesWrapper() {
	const { type } = useParams();
	return type ? <Articles type={type} /> : null;
}
