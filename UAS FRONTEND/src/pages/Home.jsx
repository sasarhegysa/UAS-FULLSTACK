import Header from "../components/Header";
import HeroSearch from "../components/HeroSearch";
import DestinasiList from "../components/DestinasiList";
import TourPackage from "../components/TourPackage";
import Footer from "../components/Footer";

const Home = () => (
  <div className="min-h-screen bg-white font-sans text-gray-900">
    <Header />
    <HeroSearch />
    <DestinasiList />
    <TourPackage />
    <Footer />
  </div>
);

export default Home;
