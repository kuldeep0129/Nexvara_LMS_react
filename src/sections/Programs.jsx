import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { EASE, Item, Stagger } from '../ui/Reveal.jsx';
import { useApp } from '../ctx.jsx';
import { usePrograms } from '../hook/useProgram.js';
import ApiError from '../ui/ApiError.jsx';

import '../styles/programs.css';
import '../styles/programspreview.css';

// Program labels
const TAG = {
  'summer-training': 'Best for vacations',
  summer: 'Best for vacations',
  internship: 'Most popular',
  apprenticeship: 'Earn while you learn',
  industrial: 'College-approved',
  project: 'Final-year ready',
};

// Safe fee display
function getFee(fee) {
  if (
    fee == null ||
    ['null', 'string', ''].includes(
      String(fee).trim().toLowerCase()
    )
  ) {
    return 'Contact us';
  }

  return fee;
}

// Loading skeleton
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

// Individual program card
function ProgramCard({ p, index }) {
  const [open, setOpen] = useState(false);
  const { setProgram } = useApp();

  const rows = [
    ['laptop', 'Mode', p.mode || 'Contact us'],
    ['cap', 'Eligibility', p.eligibility || 'Contact us'],
  ];

  // Supports either an array or comma-separated API value
  const points = Array.isArray(p.points)
    ? p.points
    : typeof p.points === 'string'
      ? p.points.split(',').map((point) => point.trim()).filter(Boolean)
      : [];

  return (
    <Item
      as="article"
      className={`pc2${open ? ' open' : ''}`}
      style={{
        '--c': p.c || '#143A70',
        '--cs': p.cs || '#CFE1F8',
      }}
    >
      <div className="pc2-in">
        <div className="pc2-top">
          <span className="pc2-ic">
            <Icon name={p.icon || 'folder'} />
          </span>

          <span className="pc2-no" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {TAG[p.id] && (
          <span className="pc2-tag">
            <i />
            {TAG[p.id]}
          </span>
        )}

        <h3>{p.title || 'Untitled program'}</h3>

        <p className="pc2-sum">
          {p.summary || p.description || 'Contact us for program details.'}
        </p>

        <div className="pc2-key">
          <div>
            <small>Duration</small>
            <b>
              <Icon name="clock" />
              {p.duration || 'Contact us'}
            </b>
          </div>

          <div>
            <small>Fee</small>
            <b className="fee">
              <Icon name="rupee" />
              {getFee(p.fee)}
            </b>
          </div>
        </div>

        <dl className="pc2-meta">
          {rows.map(([iconName, label, value]) => (
            <div key={label}>
              <dt>
                <Icon name={iconName} />
                {label}
              </dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <button
          className="pc2-more"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span>{open ? 'Hide details' : 'What you get'}</span>
          <Icon name="chevron" />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.38,
                ease: EASE,
              }}
              style={{ overflow: 'hidden' }}
            >
              {points.length > 0 ? (
                <ul className="pc2-list">
                  {points.map((point, pointIndex) => (
                    <li key={`${point}-${pointIndex}`}>
                      <Icon name="check" />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="pc2-sum">
                  Contact us for program details.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <BlobButton
          size="sm"
          variant="outline"
          href="#apply"
          block
          onClick={() => setProgram(p.title)}
          iconRight="arrow"
        >
          Apply for this program
        </BlobButton>
      </div>
    </Item>
  );
}

// Actual Programs page
export default function Programs() {
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
      aria-labelledby="h-prog"
    >
      <div className="wrap">
        <SectionHead
          eyebrow="Programs"
          id="h-prog"
          title={
            <>
              Find the program that fits{' '}
              <em className="grad">your semester</em>
            </>
          }
        >
          Explore our training, internship and apprenticeship programs.
          Compare duration, mode, eligibility and fees to find the
          right fit for your goals.
        </SectionHead>

        {/* 1. Loading state */}
        {loading && <ProgramsLoading />}

        {/* 2. API error state */}
        {!loading && error && (
          <ApiError
            title="Programs couldn't load"
            message="We couldn't fetch the latest programs. Please check your connection and try again."
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

        {/* 4. API success state */}
        {!loading && !error && programs.length > 0 && (
          <Stagger className="pgrid" gap={0.09}>
            {programs.map((program, index) => (
              <ProgramCard
                key={program.id ?? program.title ?? index}
                p={program}
                index={index}
              />
            ))}
          </Stagger>
        )}

        {/* Application disclaimer */}
        <p className="note">
          <Icon name="info" />
          *Final duration, eligibility and fees are confirmed in
          writing at the time of application.
        </p>
      </div>
    </section>
  );
}