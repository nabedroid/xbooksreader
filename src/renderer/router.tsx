/**
 * Reactルーター設定
 */
import { createHashRouter } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import BookshelfScreen from './screens/BookshelfScreen';
import DetailScreen from './screens/DetailScreen';
import SettingsScreen from './screens/SettingsScreen';

export const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <BookshelfScreen />,
      },
      {
        path: '/book/:bookId',
        element: <DetailScreen />,
      },
      {
        path: '/settings',
        element: <SettingsScreen />,
      },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});
