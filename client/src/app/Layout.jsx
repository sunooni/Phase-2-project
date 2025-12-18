import React from 'react';
import Footer from '../widgets/Footer';
import { Outlet } from 'react-router';
import CustomNavbar from '../widgets/Navbar';
import ChatBot from '../entities/ui/ChatBot';

export default function Layout({user, logoutHandler}) {
  return (
    <>
      <header>
        <CustomNavbar  user={user} logoutHandler={logoutHandler} />
      </header>
      <main>
        <Outlet user={user}/>
      </main>
      <footer>
        <Footer />
      </footer>
      <ChatBot user={user} />
    </>
  );
}