
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { Card, Item, Reveal, Stagger } from '../ui/Reveal.jsx';
import { ACHIEVEMENTS, REVIEWS, SHOTS } from '../data.js';
import '../styles/work.css';

const EASE = [0.22, 1, 0.36, 1];

export default function Work() {
  const track = useRef(null);
  const autoTimer = useRef(null);
  const pauseAuto = useRef(false);
  const reduceMotion = useReducedMotion();
  const [activeReview, setActiveReview] = useState(0);

  const scroll = (direction) => {
    const el = track.current;
    if (!el) return;

    const card = el.querySelector('.work-review-card');
    const gap = 22;
    const distance = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (direction > 0 && el.scrollLeft >= maxScroll - 8) {
      el.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    } else if (direction < 0 && el.scrollLeft <= 8) {
      el.scrollTo({
        left: maxScroll,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    } else {
      el.scrollBy({
        left: direction * distance,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
  };

  useEffect(() => {
    const el = track.current;
    if (!el || reduceMotion || REVIEWS.length < 2) return;

    const updateActive = () => {
      const cards = [...el.querySelectorAll('.work-review-card')];
      if (!cards.length) return;

      const center = el.getBoundingClientRect().left + el.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2;
        const distance = Math.abs(center - cardCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveReview(closestIndex);
    };

    el.addEventListener('scroll', updateActive, { passive: true });
    updateActive();

    autoTimer.current = window.setInterval(() => {
      if (!pauseAuto.current) scroll(1);
    }, 4500);

    return () => {
      el.removeEventListener('scroll', updateActive);
      window.clearInterval(autoTimer.current);
    };
  }, [reduceMotion]);

  const pauseSlider = () => {
    pauseAuto.current = true;
  };

  const resumeSlider = () => {
    pauseAuto.current = false;
  };

  return (
    <section
      className="sec tint work-section"
      id="work"
      aria-labelledby="h-work"
    >
      <div className="wrap work-wrap">
        <SectionHead
          eyebrow="Student work & experiences"
          id="h-work"
          title={
            <>
              Proof you <em className="grad">can check.</em>
            </>
          }
          action={<span className="demo-tag">Portfolio preview</span>}
        >
          Explore project , student experiences and learning milestones.
           reviews and achievements should be replaced with verified entries.
        </SectionHead>

        {/* Project showcase */}
        <Stagger className="shots work-shots" gap={0.13}>
          {SHOTS.map((s, index) => (
            <Card
              className="shot work-shot"
              key={s.title}
              style={{ '--c': s.c, '--cs': s.cs, padding: 0 }}
            >
              <div className="work-shot-visual">
                <div className="work-shot-topline">
                  <span className="work-window-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="work-preview-label">PROJECT 0{index + 1}</span>
                </div>

                <div className={`mock work-mock${s.kind === 'rows' ? ' rows' : ''}`}>
                  <div className="bar" style={{ width: '44%' }} />
                  <div className={`box${s.kind === 'rows' ? ' rows' : ''}`}>
                    {s.bars.map((b, i) => (
                      <motion.i
                        key={i}
                        style={
                          s.kind === 'rows'
                            ? {
                                width: `${b}%`,
                                background: 'var(--c)',
                                opacity: 1 - i * 0.16,
                                transformOrigin: 'left',
                              }
                            : {
                                height: `${b}%`,
                                transformOrigin: 'bottom',
                              }
                        }
                        initial={
                          reduceMotion
                            ? false
                            : s.kind === 'rows'
                              ? { scaleX: 0 }
                              : { scaleY: 0 }
                        }
                        whileInView={
                          s.kind === 'rows' ? { scaleX: 1 } : { scaleY: 1 }
                        }
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{
                          duration: 0.85,
                          delay: 0.15 + i * 0.07,
                          ease: EASE,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <span className="work-orb work-orb-one" />
                <span className="work-orb work-orb-two" />
              </div>

              <div className="shot-b work-shot-body">
                <div className="work-shot-heading">
                  <span className="work-project-index">0{index + 1}</span>
                  <h3>{s.title}</h3>
                  <span className="work-arrow" aria-hidden="true">
                    <Icon name="arrow" />
                  </span>
                </div>

                <div className="tags work-tags">
                  {s.tags.map((tag) => (
                    <span className="tag work-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="work-project-caption">{s.who}</p>
              </div>
            </Card>
          ))}
        </Stagger>

        {/* Reviews */}
        <Reveal className="work-reviews-heading">
          <div className="work-reviews-title">
            <span className="work-eyebrow">
              <span className="work-live-dot" />
              THE LEARNING EXPERIENCE
            </span>
            <h3>
              Stories behind <em className="grad">the progress.</em>
            </h3>
            <p>Experiences from the learning journey, one step at a time.</p>
          </div>

          <div className="arrows work-review-controls">
            <button
              className="rev"
              type="button"
              aria-label="Previous reviews"
              onClick={() => scroll(-1)}
              onMouseEnter={pauseSlider}
              onMouseLeave={resumeSlider}
            >
              <Icon name="arrow" />
            </button>
            <button
              type="button"
              aria-label="Next reviews"
              onClick={() => scroll(1)}
              onMouseEnter={pauseSlider}
              onMouseLeave={resumeSlider}
            >
              <Icon name="arrow" />
            </button>
          </div>
        </Reveal>

        <Reveal>
          <div
            className="work-review-shell"
            onMouseEnter={pauseSlider}
            onMouseLeave={resumeSlider}
            onFocusCapture={pauseSlider}
            onBlurCapture={resumeSlider}
            onTouchStart={pauseSlider}
            onTouchEnd={resumeSlider}
          >
            <div
              className="rv-track work-review-track"
              ref={track}
              tabIndex={0}
              aria-label="Student reviews carousel"
            >
              {REVIEWS.map((review, index) => (
                <motion.article
                  className="card rv work-review-card"
                  key={`${review.name}-${index}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.65,
                    delay: Math.min(index * 0.08, 0.3),
                    ease: EASE,
                  }}
                >
                  <div className="work-review-top">
                    <span className="work-quote-mark" aria-hidden="true">
                      “
                    </span>
                    <div className="stars" aria-label="5 out of 5 stars">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <Icon
                          key={star}
                          name="star"
                          className="fill"
                        />
                      ))}
                    </div>
                  </div>

                  <q>{review.text}</q>

                  <div className="who work-review-person">
                    <span
                      className="avatar work-review-avatar"
                      style={{
                        background: review.bg,
                        color: review.c,
                      }}
                    >
                      {review.init}
                    </span>

                    <div className="work-review-identity">
                      <b>{review.name}</b>
                      <small>{review.role}</small>
                    </div>

                    <span className="vbadge work-review-badge">
                      <Icon name="check" />
                      <span>Review</span>
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="work-slider-footer">
              <div className="work-slider-progress" aria-hidden="true">
                <span
                  style={{
                    width: `${
                      REVIEWS.length > 0
                        ? ((activeReview + 1) / REVIEWS.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="work-slider-count">
                {String(activeReview + 1).padStart(2, '0')}
                <span> / </span>
                {String(REVIEWS.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </Reveal>

        {/* Learning milestones */}
        <Reveal className="work-achievements-heading">
          <span className="work-eyebrow">BUILT THROUGH PRACTICE</span>
          <h3>More than just <em className="grad">a certificate.</em></h3>
        </Reveal>

        <Stagger className="ach work-achievements" gap={0.08}>
          {ACHIEVEMENTS.map(([icon, title]) => (
            <Item key={title}>
              <span className="work-achievement-icon">
                <Icon name={icon} />
              </span>
              <span>{title}</span>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
