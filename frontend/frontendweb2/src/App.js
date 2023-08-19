import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import { AuthContextProvider } from './contexts/auth-context';
import { ItemContextProvider } from './contexts/item-context';
import { OrderContextProvider } from './contexts/order-context';
import CartProvider from './contexts/CartProvider';
import Cart from './components/cart/Cart';
import Header from './components/layout/Header';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

function App() {

  const [cartIsShown, setCartIsShown] = useState(false);
  const [LoginIsShown, setLoginIsShown] = useState(false);
  const [RegisterIsShown, setRegisterIsShown] = useState(false);

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

  const showLoginFormHandler = () => {
    setLoginIsShown(true);
  };

  const hideLoginFormHandler = () => {
    setLoginIsShown(false);
  };

  const showRegisterFormHandler = () => {
    setRegisterIsShown(true);
  };

  const hideRegisterFormHandler = () => {
    setRegisterIsShown(false);
  };

  return (
    <AuthContextProvider>
      <ItemContextProvider>
        <OrderContextProvider>
          <CartProvider>
            <Router>
              {cartIsShown && <Cart onClose={hideCartHandler}/>}
              {LoginIsShown && <LoginForm onClose={hideLoginFormHandler}/>}
              {RegisterIsShown && <RegisterForm onClose={hideRegisterFormHandler}/>}
              <Header 
                onShowCart={showCartHandler}
                onShowLoginForm={showLoginFormHandler}
                onShowRegisterForm={showRegisterFormHandler} 
              />
              <main>
                <Routes>
                  
                </Routes>
              </main>
            </Router>
          </CartProvider>
        </OrderContextProvider>
      </ItemContextProvider>
    </AuthContextProvider>
  );
}

export default App;
