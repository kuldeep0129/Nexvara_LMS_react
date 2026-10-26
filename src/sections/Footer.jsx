
import Icon from '../ui/Icon.jsx';
import { Logo } from './Header.jsx';
import { useApp } from '../ctx.jsx';
import { FOOTER_COLS, SITE } from '../data.js';

const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    icon: 'linkedin',
    href: 'https://www.linkedin.com/company/nexvara-technologies/',
    className: 'social-linkedin',
  },
  {
    name: 'WhatsApp',
    icon: 'whatsapp',
    href: 'https://wa.me/918840757589',
    className: 'social-whatsapp',
  },
  {
    name: 'Instagram',
    icon: 'instagram',
    href: 'https://www.instagram.com/nexvaratechnologies?exln=ejkzbDk4bXE3NzUz',
    className: 'social-instagram',
  },
  {
    name: 'YouTube',
    icon: 'youtube',
    href: 'https://youtube.com/@nexvaratechnologies?si=WYd2aORHBQUFfMAD',
    className: 'social-youtube',
  },
];

export default function Footer() {
  const { demo } = useApp();

  return (
    <footer className="foot" id="footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Logo light />

            <p className="foot-description">
              Learn by building. Grow by creating.
              We help students turn their knowledge into
              practical skills through mentor-led training,
              internships and real-world projects.
            </p>

            <h4 className="foot-social-title">Connect with us</h4>

            <div className="soc" aria-label="Social media links">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  className={`soc-link ${social.className}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit us on ${social.name}`}
                  title={social.name}
                >
                  <Icon name={social.icon} />
                </a>
              ))}
            </div>

            <p className="foot-note">
              Have a question? Let’s build your future together.
            </p>
          </div>

          {FOOTER_COLS.map(([title, links]) => (
            <nav className="foot-column" key={title} aria-label={title}>
              <h4>{title}</h4>

              <ul>
                {links.map(([label, href]) => (
                  <li key={label}>
                    {href ? (
                      <a href={href}>{label}</a>
                    ) : (
                      <a
                        href="#footer"
                        onClick={(event) => {
                          event.preventDefault();
                          demo();
                        }}
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="foot-bottom">
          <p className="foot-copyright">
            © {new Date().getFullYear()} {SITE.name}.
            All rights reserved.
          </p>

          <a className="foot-back-top" href="#top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
