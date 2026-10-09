import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/sections/Hero.section';
import { SelectedWork } from '../components/sections/SelectedWork.section';
import { About } from '../components/sections/About.section';
import { Skills } from '../components/sections/Skills.section';
import { Experience } from '../components/sections/Experience.section';
import { Services } from '../components/sections/Services.section';
import { Contact } from '../components/sections/Contact.section';
import { profile } from '../data/profile';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{profile.name} — Software Engineer &amp; Creative Developer</title>
        <meta
          name="description"
          content={`${profile.name} — Full-Stack Developer & Software Engineer. ${profile.tagline}`}
        />
        <meta property="og:title" content={`${profile.name} — Portfolio`} />
        <meta property="og:description" content={profile.tagline} />
        <link rel="canonical" href="https://muhammadattique.dev" />
      </Helmet>

      <div>
        <Hero />
        <SelectedWork />
        <About />
        <Skills />
        <Experience />
        <Services />
        <Contact />
      </div>
    </>
  );
}

