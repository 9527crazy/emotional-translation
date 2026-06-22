import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from './components/common/Loading';

const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const DetectionPage = lazy(() => import('./pages/DetectionPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

export default function App() {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/detect" element={<DetectionPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
