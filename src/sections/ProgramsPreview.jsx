import { Link } from 'react-router-dom';

import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { Item, Reveal, Stagger } from '../ui/Reveal.jsx';
import { useApp } from '../ctx.jsx';
import { usePrograms } from '../hook/useProgram.js';
import ApiError from '../ui/ApiError.jsx';

import '../styles/programspreview.css';

const TAG = {
  'summer-training': 'Best for vacations',
  summer: 'Best for vacations',
  internship: 'Most popular',
  apprenticeship: 'Earn while you learn',
  industrial: 'College-approved',
  project: 'Final-year ready',
};

function ProgramsLoading() {
  return (
    <div
      className="ppv-skeleton-grid"
      role="status"
      aria-label="Loading programs"
    >
      <span className="ppv-loading-label">
        <span className="ppv-loading-dot" />
        Preparing your programs...
      </span>

      <div className="ppv-skeleton-row" aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <article
            className="ppv-skeleton-card"
            key={item}
            style={{ '--delay': `${item * 140}ms` }}
          >
            <div className="ppv-skeleton-top">
              <span className="ppv-skeleton-icon" />
              <span className="ppv-skeleton-number" />
            </div>

            <span className="ppv-skeleton-tag" />
            <span className="ppv-skeleton-title" />
            <span className="ppv-skeleton-line" />
            <span className="ppv-skeleton-line short" />

            <div className="ppv-skeleton-facts">
              <span />
              <span />
            </div>

            <div className="ppv-skeleton-bottom">
              <span className="ppv-skeleton-fee" />
              <span className="ppv-skeleton-button" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function ProgramsPreview() {
  const { setProgram } = useApp();

  const {
    programs = [],
    loading,
    error,
    refetch,
  } = usePrograms();

  return (
    <section
      className="sec white"
      id="programs"
      aria-labelledby="h-pprev"
    >
      <div className="wrap">
        <SectionHead
          eyebrow="Programs"
          id="h-pprev"
          title={
            <>
              Pick the program that fits{' '}
              <em className="grad">your semester</em>
            </>
          }
          action={
            <BlobButton
              to="/programs"
              variant="outline"
              iconRight="arrow"
            >
              View All Programs
            </BlobButton>
          }
        >
          From a short summer sprint to a year-long apprenticeship.
          Choose duration, mode and fee that suit you.
        </SectionHead>

        {/* 1. Loading state */}
        {loading && <ProgramsLoading />}

        {/* 2. Common API error component */}
        {!loading && error && (
          <ApiError
            title="Programs couldn't load"
            message="We couldn't fetch the latest programs right now. Please check your connection and try again."
            onRetry={refetch}
            retryText="Try again"
          />
        )}

        {/* 3. Empty state */}
        {!loading && !error && programs.length === 0 && (
          <div className="ppv-empty" role="status">
            <h3>No programs available</h3>
            <p>
              Please check back later for our latest programs.
            </p>
          </div>
        )}

        {/* 4. Successfully loaded programs */}
        {!loading && !error && programs.length > 0 && (
          <Stagger className="pp-row" gap={0.08}>
            {programs.map((p, i) => (
              <Item
                as="article"
                key={p.id ?? p.title ?? i}
                className="ppv ppv-animated"
                style={{
                  '--c': p.c || '#143A70',
                  '--cs': p.cs || '#CFE1F8',
                  '--card-delay': `${i * 100}ms`,
                }}
              >
                <div className="ppv-in">
                  <div className="ppv-top">
                    <span className="ppv-ic">
                      <Icon name={p.icon || 'folder'} />
                    </span>

                    <span
                      className="ppv-no"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {TAG[p.id] && (
                    <span className="ppv-tag">
                      <i />
                      {TAG[p.id]}
                    </span>
                  )}

                  <h3>{p.title || 'Untitled program'}</h3>

                  <p className="ppv-sum">
                    {p.summary || p.description || 'Contact us for program details.'}
                  </p>

                  <ul className="ppv-facts">
                    <li>
                      <Icon name="clock" />
                      <span>{p.duration || 'Contact us'}</span>
                    </li>

                    <li>
                      <Icon name="laptop" />
                      <span>{p.mode || 'Contact us'}</span>
                    </li>
                  </ul>

                  <div className="ppv-foot">
                    <span className="ppv-fee">
                      <small>Fee</small>
                      <b>
                        {p.fee == null ||
                        ['null', 'string', ''].includes(
                          String(p.fee).trim().toLowerCase()
                        )
                          ? 'Contact us'
                          : p.fee}
                      </b>
                    </span>
                  </div>

                  <a
                    className="ppv-apply"
                    href="#apply"
                    onClick={() => setProgram(p.title)}
                  >
                    Apply now
                  </a>
                </div>
              </Item>
            ))}
          </Stagger>
        )}

        {/* Counsellor CTA */}
        <Reveal className="ppv-more">
          <span>
            Not sure which one is right for you?
          </span>

          <Link className="ppv-all" to="/contact">
            Talk to a counsellor <Icon name="arrow" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}