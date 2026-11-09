import './setup'
import { site } from '../../content/site'
export default function SignalFooter() { return <footer className="gp-footer"><div className="gp-wrap"><p>© {new Date().getFullYear()} {site.name}</p><p>Designed and built with care in {site.location}.</p></div></footer> }
