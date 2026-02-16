import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import BuyerRegister from './pages/BuyerRegister';
import BuyerLogin from './pages/BuyerLogin';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerRegister from './pages/SellerRegister';
import SellerLogin from './pages/SellerLogin';
import SellerDashboard from './pages/SellerDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/buyer/register',
    Component: BuyerRegister,
  },
  {
    path: '/buyer/login',
    Component: BuyerLogin,
  },
  {
    path: '/buyer/dashboard',
    Component: BuyerDashboard,
  },
  {
    path: '/buyer/cart',
    Component: Cart,
  },
  {
    path: '/buyer/checkout',
    Component: Checkout,
  },
  {
    path: '/seller/register',
    Component: SellerRegister,
  },
  {
    path: '/seller/login',
    Component: SellerLogin,
  },
  {
    path: '/seller/dashboard',
    Component: SellerDashboard,
  },
]);
