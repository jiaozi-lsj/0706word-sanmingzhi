const sections = Array.from(document.querySelectorAll('.panel[data-section]'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));

const setActiveSection = (id) => {
  for (const link of navLinks) {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveSection(visible.target.id);
    },
    { rootMargin: '-18% 0px -52%', threshold: [0.08, 0.25, 0.5] }
  );

  for (const section of sections) observer.observe(section);
}

const initialSection = window.location.hash.slice(1);
setActiveSection(sections.some((section) => section.id === initialSection) ? initialSection : 'home');
