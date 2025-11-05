import { Routes, Route } from "react-router-dom";
import MainPage from "../pages/MainPage";
import UserPage from "../pages/UserPage";
import InventoryItemsPage from "../pages/InventoryItemsPage";
import InventoryEditPage from "../pages/InventoryEditPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/user/:id" element={<UserPage />} />
      <Route path="/inventory/:id" element={<InventoryItemsPage />} />
      <Route path="/inventory/:id/edit" element={<InventoryEditPage />} />
      <Route path="*" element={<MainPage />} />
    </Routes>
  );
}