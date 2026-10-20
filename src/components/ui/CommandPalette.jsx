import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowUpRight, Github, Linkedin, Mail, FileText, ArrowDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { projects } from '../../data/projects';
import { profile } from '../../data/profile';
import { Button } from '../ui/Button';

const navSections = [
  { id: 'hero', label: 'Home', href: '/', icon: () => <span className="w-2.5 h-2.5 rounded-full bg-accent" />, desc: 'Landing page with 3D avatar' },
  { id: 'work', label: 'Work', href: '/#work', icon: ArrowDown, desc: 'Selected projects showcase' },
  { id: 'projects', label: 'All Projects', href: '/projects', icon: FileText, desc: 'Complete project catalog' },
  { id: 'about', label: 'About', href: '/#about', icon: FileText, desc: 'Background and story' },
  { id: 'skills', label: 'Skills', href: '/#skills', icon: FileText, desc: 'Technical expertise' },
  { id: 'experience', label: 'Experience', href: '/#experience', icon: FileText, desc: 'Professional timeline' },
  { id: 'contact', label: 'Contact', href: '/#contact', icon: Mail, desc: 'Get in touch' },
];

const externalLinks = [
  { label: 'GitHub', href: 'https://github.com/muhammadattiique', icon: Github, desc: 'Code repositories' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-attique-45666b363', icon: Linkedin, desc: 'Professional network' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: Mail, desc: 'Direct message' },
  { label: 'Download Resume', href: profile.resumeUrl, icon: FileText, desc: 'PDF resume' },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const allItems = [...navSections, ...externalLinks, ...projects.map(p => ({
    id: p.slug,
    label: p.title,
    href: `/projects/${p.slug}`,
    icon: ArrowUpRight,
    desc: `${p.category} • ${p.year}`,
    isProject: true,
  }))];

  const filteredItems = allItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closePalette();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          selectItem(filteredItems[selectedIndex]);
        }
        break;
      default:
        break;
    }
  }, [isOpen, filteredItems, selectedIndex]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openPalette();
      }
      if (e.key === 'Escape' && isOpen) {
        closePalette();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const openPalette = () => {
    setQuery('');
    setIsOpen(true);
  };

  const closePalette = () => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  const selectItem = (item) => {
    if (item.href.startsWith('http') || item.href.startsWith('mailto:') || item.href.startsWith('/MUHAMMAD_ATTIQUE_RESUME.pdf')) {
      window.open(item.href, item.href.startsWith('mailto:') ? '_self' : '_blank');
    } else if (location.pathname === '/') {
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(item.href);
    }
    closePalette();
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-20 md:pt-32 px-4"
        onClick={closePalette}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Palette */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-4 border-b border-border relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted size-5" />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] px-2 py-0.5 rounded bg-surface-elevated border border-border text-muted">
                <span className="uppercase">⌘</span>K
              </kbd>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search projects, sections, links..."
                className="w-full pl-12 pr-16 py-3 bg-surface-elevated border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent font-sans text-sm"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Results */}
          <AnimatePresence mode="popLayout">
            <motion.ul
              key={query}
              className="max-h-[50vh] overflow-y-auto py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredItems.length === 0 ? (
                <li className="px-4 py-8 text-center text-muted font-mono text-xs">
                  No results for "{query}"
                </li>
              ) : (
                filteredItems.map((item, idx) => (
                  <motion.li
                    key={item.id || item.href}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <button
                      onClick={() => selectItem(item)}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                        idx === selectedIndex
                          ? 'bg-accent/10 border-l-2 border-accent'
                          : 'hover:bg-white/5'
                      }`}
                      role="option"
                      aria-selected={idx === selectedIndex}
                    >
                      <div className={`flex-shrink-0 p-1.5 rounded-lg ${idx === selectedIndex ? 'bg-accent/20 text-accent' : 'bg-surface-elevated text-muted'}`}>
                        {typeof item.icon === 'function' ? (
                          item.icon()
                        ) : (
                          <item.icon size={16} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-medium text-foreground truncate">{item.label}</span>
                          {item.isProject && (
                            <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/20 text-accent">
                              Project
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-muted/60 truncate block">{item.desc}</span>
                      </div>
                      <ArrowUpRight size={14} className={`flex-shrink-0 transition-transform ${idx === selectedIndex ? 'text-accent translate-x-1' : 'text-muted/50'}`} />
                    </button>
                  </motion.li>
                ))
              )}
            </motion.ul>
          </AnimatePresence>

          {/* Hint */}
          <div className="px-4 py-3 border-t border-border bg-surface/50">
            <div className="flex items-center justify-center gap-4 font-mono text-[11px] text-muted/50">
              <kbd className="px-2 py-0.5 rounded bg-surface-elevated border border-border">↑</kbd>
              <kbd className="px-2 py-0.5 rounded bg-surface-elevated border border-border">↓</kbd>
              <span>Navigate</span>
              <kbd className="px-2 py-0.5 rounded bg-surface-elevated border border-border">⏎</kbd>
              <span>Select</span>
              <kbd className="px-2 py-0.5 rounded bg-surface-elevated border border-border">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}