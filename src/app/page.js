import HomePage from "./component/home/page";
import About from "./component/about/page";
import Services from "./component/services/page";
import Skills from "./component/skills/page";
import Portfolio from "./component/portfolio/page";
import Experience from "./component/experience/page";
import CaseStudy from "./component/casestudy/page";
import Contact from "./component/contact/page";

export default function Home() {
  return (
    <>
      <HomePage />
      <About />
      <Services />
      <Skills />
      <Portfolio />
      <Experience />
      <CaseStudy />
      <Contact />
    </>
  );
}
