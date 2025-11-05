import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Library from "./pages/Library";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Protected */}
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all → redirect to homepage */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
