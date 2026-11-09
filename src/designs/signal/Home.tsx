import './setup'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { ProjectVisual } from '../../components/ProjectVisual'
import { SectionLink } from '../../components/SectionLink'
import { about, education, experience, skills } from '../../content/profile'
import { explorations, projects, statusLabel } from '../../content/projects'
import { getContactLinks, site } from '../../content/site'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

const featured = projects[0]

function Label({ children }: { children: React.ReactNode }) {
  return <p className="gp-label">{children}</p>
}

export default function SignalHome() {
  useDocumentMeta('/')
  const contacts = getContactLinks().filter((link) => link.href)

  return (
    <main id="main">
      <section id="intro" className="gp-hero">
        <div className="gp-wrap">
          <Label>Computer Engineering · Product-focused development</Label>
          <h1>I turn ideas into <span>working products.</span></h1>
          <p className="gp-hero__lede">I’m a Computer Engineering student at the Lebanese American University, focused on building practical software, designing thoughtful solutions, and shipping real applications.</p>
          <div className="gp-actions">
            <SectionLink to="work" className="gp-button gp-button--primary">Explore my work <ArrowDownRight aria-hidden /></SectionLink>
            <SectionLink to="about" className="gp-button">About me <ArrowRight aria-hidden /></SectionLink>
          </div>
          <div className="gp-hero__meta" aria-label="At a glance">
            <span><b>Based in</b>{site.location}</span><span><b>Studying</b>Computer Engineering at LAU</span><span><b>Building</b>Business software & automation</span>
          </div>
        </div>
      </section>

      <section id="work" className="gp-section"><div className="gp-wrap">
        <div className="gp-heading"><div><Label>Selected work</Label><h2>Products shaped by real problems.</h2></div><p>Software projects where engineering decisions begin with the people, workflows, and constraints involved.</p></div>
        {featured && <article className="gp-feature">
          <div className="gp-feature__visual"><ProjectVisual visual={featured.visual} active /><span>Product visual · abstract representation</span></div>
          <div className="gp-feature__copy"><div className="gp-status"><i /> {statusLabel[featured.status]}</div><h3>{featured.name}</h3><p>{featured.summary}</p><ul className="gp-tags">{featured.disciplines.slice(0, 3).map((x) => <li key={x}>{x}</li>)}</ul><Link to={`/projects/${featured.slug}`} className="gp-text-link">View project <ArrowUpRight aria-hidden /></Link></div>
        </article>}
        <div className="gp-project-grid">
          {projects.slice(1).map((project) => <Link to={`/projects/${project.slug}`} className="gp-project" key={project.slug}><div className="gp-project__visual"><ProjectVisual visual={project.visual} active /></div><div className="gp-project__body"><div className="gp-status"><i /> {statusLabel[project.status]}</div><h3>{project.name}</h3><p>{project.summary}</p><span className="gp-text-link">View project <ArrowUpRight aria-hidden /></span></div></Link>)}
          {explorations.map((project) => <article className="gp-project gp-project--concept" key={project.name}><div className="gp-concept-mark" aria-hidden>{project.name.slice(0, 2).toUpperCase()}</div><div className="gp-project__body"><div className="gp-status gp-status--concept"><i /> {statusLabel[project.status]}</div><h3>{project.name}</h3>{project.subtitle && <p className="gp-project__subtitle">{project.subtitle}</p>}<p>{project.description}</p></div></article>)}
        </div>
      </div></section>

      <section id="about" className="gp-section gp-section--surface"><div className="gp-wrap gp-about"><div><Label>About me</Label><h2>Engineering with a product mindset.</h2></div><div className="gp-about__copy"><p className="gp-about__lead">{about.lead}</p>{about.body.map((p) => <p key={p}>{p}</p>)}</div></div></section>

      <section id="experience" className="gp-section"><div className="gp-wrap">
        <div className="gp-heading"><div><Label>Experience & skills</Label><h2>A practical foundation.</h2></div><p>Technical study, hands-on software development, and first-hand experience with operational workflows.</p></div>
        <div className="gp-resume"><div className="gp-resume__column"><Label>Education</Label><article className="gp-resume__item"><span>{education.period}</span><div><h3>{education.degree}</h3><p>{education.institution} · {education.campus}</p></div></article><Label>Experience</Label>{experience.map((item) => <article className="gp-resume__item" key={item.role}><span>{item.period}</span><div><h3>{item.role}</h3><p>{item.organization}</p><ul>{item.points.map((p) => <li key={p}>{p}</li>)}</ul></div></article>)}</div><div className="gp-skill-list"><Label>Technical toolkit</Label>{skills.map((group) => <div key={group.title}><h3>{group.title}</h3><p>{group.items.join(' · ')}</p></div>)}</div></div>
      </div></section>

      <section id="contact" className="gp-contact"><div className="gp-wrap"><Label>Contact</Label><h2>Let’s build something useful.</h2><p>I’m open to internships, thoughtful collaborations, and software projects grounded in real needs.</p><div className="gp-actions">{contacts.map((link, index) => <a key={link.key} href={link.href!} target={link.key === 'email' ? undefined : '_blank'} rel={link.key === 'email' ? undefined : 'noopener noreferrer'} className={`gp-button ${index === 0 ? 'gp-button--primary' : ''}`}>{link.label} <ArrowUpRight aria-hidden /></a>)}</div></div></section>
    </main>
  )
}
