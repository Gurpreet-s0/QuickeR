import { Routes, Route, Navigate } from "react-router";
import Sender from "../Sender";
import Receiver from "../Receiver";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sender" replace />} />

      <Route path="/sender" element={<Sender />} />

      <Route path="/receiver" element={<Receiver />} />
    </Routes>
  );
};

export default AppRoutes;