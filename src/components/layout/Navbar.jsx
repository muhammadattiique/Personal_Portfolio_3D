import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile } from '../../data/profile';
import { Button } from '../ui/Button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Work', href: '#work', to: '/#work' },
    { label: 'About', href: '#about', to: '/#about' },
    { label: 'Skills', href: '#skills', to: '/#skills' },
    { label: 'Experience', href: '#experience', to: '/#experience' },
    { label: 'Contact', href: '#contact', to: '/#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleNavClick = (e, item) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we are on /projects or /projects/:slug, navigate back to home with hash
      e.preventDefault();
      navigate(item.to);
    }
    setIsOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-background/80 backdrop-blur-xl border-b border-border'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-editorial mx-auto px-5 md:px-8 flex items-center justify-between">
          {/* Logo / Name */}
          <Link
            to="/"
            className="group flex items-center gap-3 text-foreground font-display font-bold text-lg md:text-xl tracking-tight"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-subtle" />
            <span>{profile.name}</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action: Let's Talk CTA & Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <Button
              href={`mailto:${profile.email}`}
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex border-white/15 hover:border-accent text-xs"
              icon={<ArrowUpRight size={14} />}
            >
              Let's talk
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-muted hover:text-foreground rounded-lg transition-colors"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-x-0 top-[65px] z-40 bg-background/95 backdrop-blur-2xl border-b border-border md:hidden p-6 shadow-2xl"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link, idx) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="flex items-center justify-between py-3 border-b border-border/50 font-display text-xl font-medium text-foreground hover:text-accent transition-colors"
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-muted/60">0{idx + 1}</span>
                </a>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                <Button
                  href={`mailto:${profile.email}`}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Let's talk ({profile.email})
                </Button>
                <div className="flex items-center justify-between text-xs font-mono text-muted pt-2">
                  <span>{profile.location}</span>
                  <span className="text-accent">{profile.status}</span>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

