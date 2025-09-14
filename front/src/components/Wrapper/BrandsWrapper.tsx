import { useParams } from "react-router-dom";
import Brand from "../../pages/Brand";

export default function BrandsWrapper() {
	const { brand } = useParams();
	return brand ? <Brand brand={brand} /> : null;
}
