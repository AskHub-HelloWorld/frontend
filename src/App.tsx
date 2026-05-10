import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { PrivateRoute } from './router/PrivateRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Main Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ChatPage } from './pages/chat/ChatPage';
import { KnowledgePage } from './pages/knowledge/KnowledgePage';
import { PostDetailPage } from './pages/knowledge/PostDetailPage';
import { WritePostPage } from './pages/knowledge/WritePostPage';
import { StorePage } from './pages/store/StorePage';
import { MyPage } from './pages/mypage/MyPage';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout><Navigate to="/dashboard" /></AppLayout>} path="/" />
        
        <Route element={<AppLayout><DashboardPage /></AppLayout>} path="/dashboard" />
        <Route element={<AppLayout><ChatPage /></AppLayout>} path="/chat" />
        
        {/* Knowledge Routes */}
        <Route element={<AppLayout><KnowledgePage /></AppLayout>} path="/knowledge" />
        <Route element={<AppLayout><WritePostPage /></AppLayout>} path="/knowledge/write" />
        <Route element={<AppLayout><PostDetailPage /></AppLayout>} path="/knowledge/post/:id" />
        
        {/* Other Pages */}
        <Route element={<AppLayout><StorePage /></AppLayout>} path="/store" />
        <Route element={<AppLayout><MyPage /></AppLayout>} path="/mypage" />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
