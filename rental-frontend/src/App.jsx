import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./Pages/Home";
import Properties from "./Pages/Properties";
import PropertyDetails from "./Pages/PropertyDetails";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ListProperty from "./Pages/ListProperty";
import MyProperties from "./Pages/MyProperties";
import Favorites from "./Pages/Favorites";
import Profile from "./Pages/Profile";
import About from "./Pages/About";

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