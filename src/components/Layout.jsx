import Starfield  from './ui/Starfield.jsx';
import Navbar     from './nav/Navbar.jsx';
import Footer     from './ui/Footer.jsx';
import LightboxRoot from './ui/Lightbox.jsx';

export default function Layout({ children }) {
  return (
    <>
      <Starfield />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <LightboxRoot.Portal />
    </>
  );
}
