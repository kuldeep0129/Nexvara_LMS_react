import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Icon from '../ui/Icon.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { EASE, Reveal } from '../ui/Reveal.jsx';
import { useApp } from '../ctx.jsx';
import { useCourses } from '../hook/useCourses.js';
import ApiError from '../ui/ApiError.jsx';

import '../styles/courses.css';

const LEVEL = {
  Beginner: 1,
  'Beginner+': 2,
  Intermediate: 3,
};

const COURSE_FILTERS = [
  { id: 'all', label: 'All Courses' },
  { id: 'development', label: 'Development' },
  { id: 'ai', label: 'AI & Machine Learning' },
  { id: 'data', label: 'Data Analytics' },
  { id: 'cloud', label: 'Cloud & DevOps' },
  { id: 'testing', label: 'Software Testing' },
];

const pop = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.94 },
  transition: { duration: 0.35, ease: EASE },
};

// API does not currently return a category field.
// This helper assigns a display category based on the course title.
function getCourseCategory(course) {
  const title = (course.title || '').toLowerCase();

  if (title.includes('artificial intelligence') ||
      title.includes('machine learning') ||
      title.includes('ai ')) {
    return 'ai';
  }

  if (title.includes('data analytics')) {
    return 'data';
  }

  if (title.includes('cloud') || title.includes('devops')) {
    return 'cloud';
  }

  if (title.includes('testing') || title.includes('selenium')) {
    return 'testing';
  }

  return 'development';
}

function CoursesLoading() {
  return (
    <div className="cgrid" role="status" aria-label="Loading courses">
      {[0, 1, 2, 3].map((item) => (
        <article className="tc" key={item} aria-hidden="true">
          <div className="tc-top">
            <span className="tc-mono"> </span>
          </div>
          <div className="course-skeleton-title" />
          <div className="course-skeleton-line" />
          <div className="course-skeleton-line short" />
          <p>Loading course details...</p>
        </article>
      ))}
    </div>
  );
}

export default function Courses() {
  const { demo, setProgram } = useApp();

  const {
    courses = [],
    loading,
    error,
    refetch,
  } = useCourses(false);

  const [f, setF] = useState('all');

  const list = courses.filter((course) => {
    return f === 'all' || getCourseCategory(course) === f;
  });

  function handleEnquiry(course) {
    setProgram(course?.title || 'Not sure (counselling)');
  }

  return (
    <section className="sec" id="courses" aria-labelledby="h-courses">
      <div className="wrap">
        <SectionHead
          eyebrow="Courses"
          id="h-courses"
          title={
            <>
              Pick a stack and{' '}
              <em className="grad">build with it</em>
            </>
          }
        >
          Every course ends with a project you can put on GitHub.
          Filter by the kind of work you want to do.
        </SectionHead>

        {!loading && !error && courses.length > 0 && (
          <Reveal>
            <div className="chips" role="group" aria-label="Filter courses">
              {COURSE_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  className="chip"
                  type="button"
                  aria-pressed={f === filter.id}
                  onClick={() => setF(filter.id)}
                >
                  {f === filter.id && (
                    <motion.span
                      layoutId="course-chip"
                      className="chip-pill"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 34,
                      }}
                    />
                  )}
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {loading && <CoursesLoading />}

        {!loading && error && (
          <ApiError
            title="Courses couldn't load"
            message={
              typeof error === 'string'
                ? error
                : "We couldn't fetch the latest courses. Please try again."
            }
            onRetry={refetch}
            retryText="Try again"
          />
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="ppv-empty" role="status">
            <h3>No courses available</h3>
            <p>Please check back later for our latest courses.</p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && list.length === 0 && (
          <div className="ppv-empty" role="status">
            <h3>No courses in this category</h3>
            <p>Try another category to explore more courses.</p>
            <button
              className="chip"
              type="button"
              onClick={() => setF('all')}
            >
              View all courses
            </button>
          </div>
        )}

        {!loading && !error && list.length > 0 && (
          <Reveal>
            <motion.div className="cgrid" layout>
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((course) => {
                  const levelValue = LEVEL[course.level] || 0;
                  const tags = Array.isArray(course.tags)
                    ? course.tags
                    : [];
                  const modules = Array.isArray(course.modules)
                    ? course.modules
                    : [];
                  const projectName = course.build || '';

                  return (
                    <motion.article
                      layout
                      key={course.id ?? course.slug ?? course.title}
                      className="tc"
                      style={{
                        '--c': course.c || '#143A70',
                        '--cs': course.cs || '#CFE1F8',
                      }}
                      {...pop}
                    >
                      <div className="tc-top">
                        <span className="tc-mono">
                          <i
                            className={course.mono || ''}
                            aria-hidden="true"
                          />
                        </span>

                        {course.badge && (
                          <span className="tc-badge">
                            <i aria-hidden="true" />
                            {course.badge}
                          </span>
                        )}
                      </div>

                      <h3>{course.title}</h3>

                      <p className="tc-desc">
                        {course.desc || 'Contact us for course details.'}
                      </p>

                      <div className="tags">
                        {tags.map((tag, index) => (
                          <span className="tag" key={`${tag}-${index}`}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {modules.length > 0 && (
                        <ul
                          className="tc-learn"
                          aria-label={`What you learn in ${course.title}`}
                        >
                          {modules.slice(0, 3).map((module, index) => (
                            <li key={`${module}-${index}`}>
                              <Icon name="check" />
                              {module}
                            </li>
                          ))}
                        </ul>
                      )}

                      {projectName && (
                        <div className="tc-proj">
                          <span>
                            <Icon name="code" />
                          </span>
                          <div>
                            <small>Final project</small>
                            <b>{projectName}</b>
                          </div>
                        </div>
                      )}

                      <div className="tc-foot">
                        <div className="cmeta">
                          <span>
                            <Icon name="clock" />
                            {course.weeks
                              ? `${course.weeks} weeks`
                              : 'Duration on request'}
                          </span>

                          <span>
                            <Icon name="trend" />
                            {course.level || 'All levels'}
                          </span>

                          <span className="tc-lv" aria-hidden="true">
                            {[0, 1, 2].map((number) => (
                              <i
                                key={number}
                                className={
                                  number < levelValue ? 'on' : ''
                                }
                              />
                            ))}
                          </span>
                        </div>

                        <div className="tc-act">
                          <a
                            className="tc-link"
                            href="#course-enquiry"
                            onClick={(event) => {
                              event.preventDefault();
                              demo();
                            }}
                          >
                            Syllabus <Icon name="arrow" />
                          </a>

                          <a
                            className="tc-apply"
                            href="#apply"
                            onClick={() => handleEnquiry(course)}
                          >
                            Enquire
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}

                {f === 'all' && (
                  <motion.div
                    layout
                    key="more"
                    className="more"
                    {...pop}
                  >
                    <h3>More courses on the way</h3>
                    <p>
                      Cyber Security, UI/UX and Mobile Development will
                      be added after their syllabuses and mentors are
                      verified.
                    </p>
                    <a
                      className="lnk"
                      href="#apply"
                      onClick={() =>
                        setProgram('Not sure (counselling)')
                      }
                    >
                      Ask the counselling desk <Icon name="arrow" />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
