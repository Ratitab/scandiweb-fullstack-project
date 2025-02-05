import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; 
import DefaultHeader from "./views/app/DefaultHeader";
import AllMainProducts from "./pages/allMainProducts";
import AllClothesProducts from "./pages/clothes";
import ProductDetailPage from "./pages/prodcutsDetailPage";
import AllTechProducts from "./pages/tech";
import { CartProvider } from "./context/cartContext";


function App() {
  return (
    <BrowserRouter>
    <CartProvider>


      <DefaultHeader />
      <Routes>
        <Route path="/" element={<Navigate to="/all" replace />} />
        <Route path="/all" element={<AllMainProducts  />} />
        <Route path="/clothes" element={<AllClothesProducts />} />
        <Route path="/tech" element={<AllTechProducts />} />
        <Route path="/all/:id" element={<ProductDetailPage />} />
        <Route path="/clothes/:id" element={<ProductDetailPage />} />
        <Route path="/tech/:id" element={<ProductDetailPage />} />
      </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
