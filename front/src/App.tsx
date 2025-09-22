import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import BrandIcon from "./components/BrandIcon/BrandIcon";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ArticlesWrapper from "./components/Wrapper/ArticlesWrapper";
import BrandsWrapper from "./components/Wrapper/BrandsWrapper";
import AboutUs from "./pages/AboutUs";
import Article from "./pages/Article";
import Cart from "./pages/Cart";
import Connection from "./pages/Connection";
import Homepage from "./pages/Homepage";
import LegalNotice from "./pages/LegalNotice";
import Login from "./pages/login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import TermsOfSale from "./pages/TermsOfSale";
import CreateArticle from "./components/Form/Admin/CreateArticle";
import AdminProfile from "./pages/AdminProfile";
import AllArticles from "./pages/AllArticles";

function App() {
	return (
		<BrowserRouter>
			<div className="flex flex-col xl:items-center justify-center min-h-screen bg-gray-50">
				<div className="w-full 2xl:w-3/5 3xl:!w-1/2 flex-1">
					<ScrollToTop />
					<Header />
					<Navbar />
					<BrandIcon />
					<div className="px-3">
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/connexion" element={<Connection />} />

							<Route path="/CreateArticle" element={<CreateArticle />} />

							<Route path="/articles" element={<ArticlesWrapper />} />

							<Route path="/allArticle" element={<AllArticles />} />
							<Route path="/articles/:type" element={<ArticlesWrapper />} />
							<Route path="/articles/:type/:name" element={<Article />} />

							<Route path="/marques/:brand" element={<BrandsWrapper />} />

							<Route path="/admin/profile" element={<AdminProfile />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/cart" element={<Cart />} />
							<Route path="/" element={<Homepage />} />
							<Route
								path="/politique-de-confidentialite"
								element={<PrivacyPolicy />}
							/>
							<Route path="/mentions-legales" element={<LegalNotice />} />
							<Route
								path="/conditions-generales-de-vente"
								element={<TermsOfSale />}
							/>
							<Route path="/a-propos-de-nous" element={<AboutUs />} />
						</Routes>
					</div>
				</div>

				<div className="w-full">
					<Footer />
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
