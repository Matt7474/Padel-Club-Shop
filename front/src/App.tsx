import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import BrandIcon from "./components/BrandIcon/BrandIcon";
import Footer from "./components/Footer/Footer";
import CreateArticle from "./components/Form/Admin/CreateArticle";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import NotificationProvider from "./components/NotificationProvider/NotificationProvider";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ToastContainer from "./components/ToastContainer/ToastContainer";
import ArticlesWrapper from "./components/Wrapper/ArticlesWrapper";
import BrandsWrapper from "./components/Wrapper/BrandsWrapper";
import AboutUs from "./pages/AboutUs";
import AllArticles from "./pages/AllArticles";
import Article from "./pages/Article";
import Contact from "./pages/Contact";
import Homepage from "./pages/Homepage";
import LegalNotice from "./pages/LegalNotice";
import Login from "./pages/login";
import Paiement from "./pages/Paiement";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProfileMenu from "./pages/ProfileMenu";
import Register from "./pages/Register";
import RequestResetPassword from "./pages/RequestResetPassword";
import ResetPassword from "./pages/ResetPassword";
import Shipping from "./pages/Shipping";
import TermsOfSale from "./pages/TermsOfSale";

function App() {
	return (
		<BrowserRouter>
			<div className="flex flex-col xl:items-center justify-center min-h-screen bg-gray-50">
				<div className="w-full 2xl:w-3/5 3xl:w-1/2 flex-1">
					<ScrollToTop />
					<NotificationProvider />
					<Header />
					<Navbar />
					<BrandIcon />
					<div className="px-3">
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route
								path="/CreateArticle"
								element={<CreateArticle mode={"create"} />}
							/>
							<Route path="/articles" element={<ArticlesWrapper />} />
							<Route path="/allArticle" element={<AllArticles />} />
							<Route path="/articles/:type" element={<ArticlesWrapper />} />
							<Route path="/articles/:type/:name" element={<Article />} />
							<Route path="/marques/:brand" element={<BrandsWrapper />} />
							<Route path="/profile" element={<ProfileMenu />} />
							{/* <Route path="/profile" element={<ProfileMenu />} /> */}
							<Route path="/paiement" element={<Paiement />} />
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
							<Route path="/livraison" element={<Shipping />} />
							<Route path="/a-propos-de-nous" element={<AboutUs />} />
							<Route path="/contact" element={<Contact />} />

							<Route path="/reset-password" element={<ResetPassword />} />
							{/* <Route path="/ggg" element={<Ggg />} /> */}

							<Route
								path="/request-reset-password"
								element={<RequestResetPassword />}
							/>
						</Routes>
					</div>
				</div>
				<ToastContainer />

				<div className="w-full">
					<Footer />
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
