import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./Pages/Login";
import Register from "./pages/Register";
import ListProperty from "./pages/ListProperty";
import MyProperties from "./pages/MyProperties";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/properties" element={<Properties />} />

          <Route
            path="/properties/:id"
            element={<PropertyDetails />}
          />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />


          <Route
            path="/my-properties"
            element={<MyProperties />}
          />

          <Route
            path="/favorites"
            element={<Favorites />}
          />

          <Route path="/profile" element={<Profile />} />

          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;