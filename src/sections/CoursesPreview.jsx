import { Link } from 'react-router-dom';

import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { Item, Reveal, Stagger } from '../ui/Reveal.jsx';
import { useCourses } from '../hook/useCourses.js';
import ApiError from '../ui/ApiError.jsx';

import '../styles/coursespreview.css';

const FEATURED = [
  '.NET Full Stack',
  'React and Next.js',
  'AI and Machine Learning',
  'Data Analytics',
];

const LEVEL = {
  Beginner: 1,
  'Beginner+': 2,
  Intermediate: 3,
};

function CoursesLoading() {
  return (
    <div
      className="cp-loading"
      role="status"
      aria-label="Loading courses"
    >
      <span className="cp-loading-label">
        <span className="cp-loading-dot" />
        Preparing your courses...
      </span>

      <div className="cp-loading-grid" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => (
          <article
            className="cp-skeleton"
            key={item}
            style={{ '--delay': `${item * 120}ms` }}
          >
            <span className="cp-skeleton-top" />
            <span className="cp-skeleton-title" />
            <span className="cp-skeleton-line" />
            <span className="cp-skeleton-line short" />
            <span className="cp-skeleton-tags" />
            <span className="cp-skeleton-meta" />
            <span className="cp-skeleton-button" />
          </article>
        ))}
      </div>
    </div>
  );
}

export default function CoursesPreview() {
  // false means the API should return all available courses.
  const {
    courses,
    loading,
    error,
    refetch,
  } = useCourses(false);

  // Select only the desired courses for the home page.
  // The full catalogue can still appear on /courses.
  const featuredCourses = FEATURED
    .map((title) => courses.find((course) => course.title === title))
    .filter(Boolean);

  return (
    <section
      className="sec"
      id="courses"
      aria-labelledby="h-cprev"
    >
      <div className="wrap">
        <SectionHead
          eyebrow="Popular courses"
          id="h-cprev"
          title={
            <>
              Learn what companies{' '}
              <em className="grad">hire for</em>
            </>
          }
          action={
            <BlobButton
              variant="outline"
              to="/courses"
              iconRight="arrow"
            >
              View All Courses
            </BlobButton>
          }
        >
          Job-focused, project-based tracks. Every course ends with
          a project you can put on GitHub.
        </SectionHead>

        {/* 1. Loading */}
        {loading && <CoursesLoading />}

        {/* 2. API error */}
        {!loading && error && (
          <ApiError
            title="Courses couldn't load"
            message="We couldn't fetch the latest courses. Please check your connection and try again."
            onRetry={refetch}
            retryText="Try again"
          />
        )}

        {/* 3. API returned no courses */}
        {!loading && !error && courses.length === 0 && (
          <div className="ppv-empty" role="status">
            <h3>No courses available</h3>
            <p>Please check back later for our latest courses.</p>
          </div>
        )}

        {/* 4. Courses loaded, but none match the featured list */}
        {!loading &&
          !error &&
          courses.length > 0 &&
          featuredCourses.length === 0 && (
            <div className="ppv-empty" role="status">
              <h3>Featured courses are being updated</h3>
              <p>Explore our complete course catalogue.</p>
              <BlobButton to="/courses" variant="outline" iconRight="arrow">
                View All Courses
              </BlobButton>
            </div>
          )}

        {/* 5. Featured courses */}
        {!loading && !error && featuredCourses.length > 0 && (
          <Stagger className="cp-row" gap={0.08}>
            {featuredCourses.map((course) => {
              const levelValue = LEVEL[course.level] || 0;

              return (
                <Item
                  as="article"
                  key={course.id ?? course.slug ?? course.title}
                  className="cpv"
                  style={{
                    '--c': course.c,
                    '--cs': course.cs,
                  }}
                >
                  <div className="cpv-in">
                    <div className="cpv-top">
                      <span className="cpv-mono">
                        <i
                          className={course.mono}
                          aria-hidden="true"
                        />
                      </span>

                      {course.badge && (
                        <span className="cpv-badge">
                          <i aria-hidden="true" />
                          {course.badge}
                        </span>
                      )}
                    </div>

                    <h3>{course.title}</h3>

                    <p className="cpv-desc">
                      {course.desc || 'Contact us for course details.'}
                    </p>

                    <div className="tags">
                      {course.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="cpv-meta">
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

                      <span
                        className="cpv-lv"
                        aria-hidden="true"
                      >
                        {[0, 1, 2].map((n) => (
                          <i
                            key={n}
                            className={n < levelValue ? 'on' : ''}
                          />
                        ))}
                      </span>
                    </div>

                    <Link
                      className="cpv-link"
                      to="/courses"
                      aria-label={`Explore ${course.title}`}
                    >
                      Explore course <Icon name="arrow" />
                    </Link>
                  </div>
                </Item>
              );
            })}
          </Stagger>
        )}

        <Reveal className="cpv-more">
          <p>
            Looking for Java, Python, Cloud or Testing?
            We run multiple learning tracks.
          </p>

          <Link to="/courses" className="cpv-all">
            See all courses <Icon name="arrow" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
