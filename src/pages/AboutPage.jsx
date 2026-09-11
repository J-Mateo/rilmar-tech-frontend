import {
  ArrowRight,
  BadgeCheck,
  Lightbulb,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import styles from './AboutPage.module.css';

const VALUES = [
  {
    title: 'Tecnología útil',
    text:
      'Productos pensados para aportar una mejora real en casa, en el trabajo y en tu tiempo libre.',
    icon: Lightbulb,
  },
  {
    title: 'Selección cuidada',
    text:
      'Una selección clara y organizada para ayudarte a encontrar más fácilmente lo que encaja contigo.',
    icon: BadgeCheck,
  },
  {
    title: 'Compra con confianza',
    text:
      'Una experiencia sencilla y segura que te acompaña desde que descubres un producto hasta el pago.',
    icon: ShieldCheck,
  },
  {
    title: 'Innovación accesible',
    text:
      'Tecnología actual para el hogar, el trabajo, la productividad, la creatividad y el entretenimiento.',
    icon: Sparkles,
  },
];

const AboutPage = () => {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          Sobre Rilmar Tech
        </p>

        <h1 className={styles.title}>
          Tecnología pensada para formar parte de
          tu día a día.
        </h1>

        <p className={styles.intro}>
          En RILMARTECH creemos que la tecnología
          debe hacer las cosas más fáciles, más
          cómodas y más interesantes. Por eso
          reunimos productos útiles para distintos
          momentos de tu vida y los presentamos de
          una forma sencilla de descubrir y elegir.
        </p>
      </section>

      <section
        className={styles.principles}
        aria-labelledby="principles-title"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>
            Nuestra forma de elegir
          </p>

          <h2
            id="principles-title"
            className={styles.sectionTitle}
          >
            Tecnología elegida para tu día a día.
          </h2>

          <p className={styles.sectionText}>
            Organizamos nuestra selección pensando
            en cómo utilizas la tecnología:
            escuchar, trabajar, crear, organizarte
            y hacer tu hogar más cómodo.
          </p>
        </div>

        <div className={styles.valueGrid}>
          {VALUES.map(
            ({
              title,
              text,
              icon: Icon,
            }) => (
              <article
                key={title}
                className={styles.valueCard}
              >
                <span className={styles.valueIcon}>
                  <Icon
                    size={23}
                    aria-hidden="true"
                  />
                </span>

                <h3>{title}</h3>

                <p>{text}</p>
              </article>
            )
          )}
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <p className={styles.eyebrow}>
            Descubre la selección
          </p>

          <h2>
            Encuentra la tecnología que encaja
            contigo.
          </h2>

          <p>
            Explora el catálogo por categoría,
            disponibilidad y precio.
          </p>
        </div>

        <Link
          to="/products"
          className={styles.ctaLink}
        >
          Ver catálogo

          <ArrowRight
            size={18}
            aria-hidden="true"
          />
        </Link>
      </section>
    </main>
  );
};

export default AboutPage;