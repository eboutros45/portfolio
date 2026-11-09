import './setup'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { SectionLink } from '../../components/SectionLink'
import { site } from '../../content/site'
import { scrollToTop } from '../../lib/scroll'

const links = [{ id: 'work', label: 'Work' }, { id: 'about', label: 'About' }, { id: 'experience', label: 'Experience' }, { id: 'contact', label: 'Contact' }]
export default function SignalNav() {
  const { pathname } = useLocation(); const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])
  return <header className="gp-nav"><nav className="gp-wrap gp-nav__row" aria-label="Primary"><Link to="/" className="gp-nav__brand" onClick={(e) => { if (pathname === '/') { e.preventDefault(); scrollToTop() } }}>{site.name}</Link><button className="gp-nav__toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><ul className={open ? 'gp-nav__links is-open' : 'gp-nav__links'}>{links.map((link) => <li key={link.id}><SectionLink to={link.id}>{link.label}</SectionLink></li>)}</ul></nav></header>
}
