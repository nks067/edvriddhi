import {
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Mic,
  MonitorPlay,
  PlayCircle,
  Radio,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Video,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type Role = 'student' | 'teacher';
type Page =
  | 'home'
  | 'about'
  | 'courses'
  | 'downloads'
  | 'blog'
  | 'pyq'
  | 'campus'
  | 'daily'
  | 'auth'
  | 'recorded'
  | 'live';

type User = {
  name: string;
  role: Role;
  batch: string;
};

type ChatMessage = {
  id: number;
  sender: 'bot' | 'user';
  text: string;
};

type Lecture = {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  duration: string;
  watched: number;
  thumbnail: string;
  tag: string;
};

type LiveClass = {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  startsAt: string;
  status: 'Live' | 'Upcoming';
  attendees: number;
};

const heroImage =
  'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80';
const teacherImage =
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80';

const demoLectures: Lecture[] = [
  {
    id: 1,
    title: 'Polity: Fundamental Rights and Landmark Judgments',
    subject: 'GS Paper II',
    teacher: 'Anjali Sharma',
    duration: '1h 22m',
    watched: 72,
    thumbnail:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=700&q=80',
    tag: 'UPSC CSE Foundation 2027',
  },
  {
    id: 2,
    title: 'Current Affairs: Economy, Budget and Schemes',
    subject: 'Current Affairs',
    teacher: 'Raghav Verma',
    duration: '1h 05m',
    watched: 45,
    thumbnail:
      'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=700&q=80',
    tag: 'Daily News Analysis',
  },
  {
    id: 3,
    title: 'Mains Answer Writing: GS III Structure and Enrichment',
    subject: 'Mains Practice',
    teacher: 'Kavya Rao',
    duration: '1h 12m',
    watched: 91,
    thumbnail:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=700&q=80',
    tag: 'Answer Writing Lab',
  },
];

const demoLiveClasses: LiveClass[] = [
  {
    id: 1,
    title: 'UPSC Prelims: Polity MCQ Elimination Workshop',
    subject: 'Prelims GS',
    teacher: 'Anjali Sharma',
    startsAt: 'Today, 7:00 PM',
    status: 'Live',
    attendees: 1842,
  },
  {
    id: 2,
    title: 'Mains Essay: Governance and Social Justice Themes',
    subject: 'Essay',
    teacher: 'Meera Iyer',
    startsAt: 'Tomorrow, 6:30 PM',
    status: 'Upcoming',
    attendees: 930,
  },
];

const courseStats = [
  ['AI Mentor', 'Personalized learning paths'],
  ['Daily CA', 'News, PIB and editorials'],
  ['Smart Tests', 'Prelims and Mains analytics'],
  ['Interview Ready', 'DAF and personality support'],
];

const aiFeatures = [
  ['Personalized UPSC Planner', 'AI maps Prelims, Mains, CSAT, optional and revision tasks into a realistic weekly plan.'],
  ['Current Affairs Intelligence', 'Daily news is grouped into Polity, Economy, IR, Environment, S&T and social issues themes.'],
  ['Answer Writing Feedback', 'Mains practice gets structure, value-add, examples and time-management suggestions.'],
];

const upscTracks = [
  ['Prelims GS + CSAT', 'Objective practice, PYQ analysis, elimination strategies, CSAT boosters and full-length mocks.'],
  ['Mains GS + Essay', 'GS I-IV lectures, ethics case studies, essay themes, answer writing drills and evaluated copies.'],
  ['Optional + Interview', 'Optional subject support, DAF-based interview preparation, mock boards and personality mentoring.'],
];

const legacyHighlights = [
  ['IAS Masterpiece in India', 'Your comprehensive platform for UPSC Civil Services Examination preparation.'],
  ['Structured Programs', 'Access structured UPSC programs, expert guidance and personalized learning paths.'],
  ['Bangalore Learning Hub', 'EdVriddhi, 4th floor, 1443, 80 Feet Rd, Nagarbhavi 1st Stage, BDA Layout, Chandra Layout, Bengaluru, Karnataka 560040.'],
  ['Student Support', 'Reach the EdVriddhi team at 9611196688 for admissions, course guidance and program support.'],
];

const scoreVriddhiFeatures = [
  ['AI Test Series', "India's smartest UPSC Prelims practice platform with personalised AI tests, real exam simulation and deep performance analytics."],
  ['UPSC Pattern Practice', 'Questions follow the UPSC CSE Prelims pattern with standard +2 and -0.67 marking.'],
  ['Topic-Level Control', 'Choose from Polity, History, Geography, Environment, Economics, Science & Tech and more, down to chapter level.'],
  ['Vriddhi Analysis PDF', 'Every test creates a branded report with question-wise analysis, correct answers, explanations and UPSC source context.'],
];

const scoreVriddhiSteps = [
  ['01', 'Pick Your Subject & Topics', 'Choose the subject and chapter-level topics you want to practice.'],
  ['02', 'Select Test Format', 'Use 5Q, 15Q, 20Q or 30Q formats with matching time limits.'],
  ['03', 'Take the Test', 'AI generates fresh questions, lets you mark for review and navigate freely.'],
  ['04', 'Analyse & Download', 'Review answers, see topic-wise stats and download your Vriddhi Analysis PDF report.'],
];

const examInfoCards = [
  ['Age Limits', 'Minimum age: 21 years. Maximum age for General category: 32 years. Relaxations include SC/ST +5 years, OBC +3 years and PwBD +10 years.'],
  ['Educational Qualification', 'Must hold a graduate degree from a recognised university. Final-year graduation candidates can also appear.'],
  ['Number of Attempts', 'General/EWS: 6 attempts, OBC: 9 attempts, SC/ST: unlimited within age limit, PwBD categories as per UPSC rules.'],
  ['Examination Fee', 'Preliminary Examination fee is Rs. 100 and Main Examination additional fee is Rs. 200. Female, SC/ST and PwBD candidates are exempted.'],
  ['Important Dates - CSE 2026', 'Notification: 4 February 2026. Last date: 24 February 2026 till 6:00 PM. Prelims: 24 May 2026. Mains and Interview to be notified.'],
  ['Conducting Body', 'The examination is conducted by the Union Public Service Commission, an independent constitutional body under Article 315.'],
];

const syllabusHighlights = [
  ['Prelims GS Paper I', 'Current events, History of India, Indian National Movement, Indian and World Geography, Polity, Governance, Economy, Social Development, Environment and General Science.'],
  ['Prelims CSAT', 'Comprehension, interpersonal skills, logical reasoning, analytical ability, decision making, problem solving, basic numeracy and data interpretation.'],
  ['Mains GS I', 'Indian culture, modern history, freedom struggle, post-independence consolidation, world history, Indian society and world physical geography.'],
  ['Mains GS II', 'Constitution, federalism, Parliament, judiciary, governance, welfare schemes, social justice, civil services, international relations and institutions.'],
  ['Mains GS III', 'Economy, budgeting, agriculture, food security, infrastructure, science and technology, environment, disaster management and internal security.'],
  ['Mains GS IV', 'Ethics, human values, attitude, aptitude, emotional intelligence, probity in governance and case studies.'],
];

const resourceLinks = [
  ['downloads', 'Downloads', 'UPSC planners, monthly current affairs PDFs, syllabus trackers and answer writing templates.'],
  ['blog', 'Blog', 'Strategy notes on Prelims, Mains, optional selection, interview preparation and study discipline.'],
  ['pyq-vriddhi-resource', 'PYQ Vriddhi', 'Previous year questions organized by subject, stage, topic and difficulty for faster revision.'],
  ['campus-vriddhi', 'Campus Vriddhi', 'Hybrid classroom updates, mentorship circles, workshops and campus learning events.'],
  ['daily-vriddhi', 'Daily Vriddhi', 'Daily current affairs, editorial briefs, quiz prompts and AI-curated revision tasks.'],
];

const fakeApi = {
  login: (role: Role, name: string) =>
    new Promise<User>((resolve) => {
      setTimeout(
        () =>
          resolve({
            name: name || (role === 'student' ? 'Aarav Student' : 'Priya Teacher'),
            role,
            batch: role === 'student' ? 'UPSC CSE Foundation 2027' : 'UPSC GS Faculty',
          }),
        550
      );
    }),
  signup: (role: Role, name: string, batch: string) =>
    new Promise<User>((resolve) => {
      setTimeout(
        () =>
          resolve({
            name: name || (role === 'student' ? 'New Student' : 'New Teacher'),
            role,
            batch: batch || (role === 'student' ? 'UPSC CSE Foundation 2027' : 'UPSC GS Faculty'),
          }),
        650
      );
    }),
  getLectures: () =>
    new Promise<Lecture[]>((resolve) => setTimeout(() => resolve(demoLectures), 400)),
  getLiveClasses: () =>
    new Promise<LiveClass[]>((resolve) => setTimeout(() => resolve(demoLiveClasses), 400)),
  startClass: () =>
    new Promise<{ meetingId: string }>((resolve) =>
      setTimeout(() => resolve({ meetingId: 'EV-LIVE-2407' }), 700)
    ),
  askVriddhi: (question: string) =>
    new Promise<string>((resolve) => {
      setTimeout(() => {
        const normalized = question.toLowerCase();
        if (normalized.includes('course') || normalized.includes('batch')) {
          resolve('AdVriddhi offers UPSC GS Foundation, Prelims Booster, Mains Answer Writing, CSAT, Optional and Interview guidance programs.');
          return;
        }
        if (normalized.includes('pyq') || normalized.includes('test')) {
          resolve('PYQ Vriddhi and Score Vriddhi help you practice UPSC pattern questions, analyze weak areas and download performance reports.');
          return;
        }
        if (normalized.includes('current') || normalized.includes('daily')) {
          resolve('Daily Vriddhi gives current affairs, editorial briefs, daily quizzes and AI revision tasks for UPSC preparation.');
          return;
        }
        resolve('I can help with UPSC courses, live classes, recorded lectures, PYQs, Daily Vriddhi, downloads and enrollment. Your backend API can replace this dummy response later.');
      }, 700);
    }),
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('home');
  const dashboardView = page === 'recorded' || page === 'live' ? page : 'home';

  return (
    <main>
      <Header
        user={user}
        page={page}
        setPage={setPage}
        onAuthSuccess={(nextUser) => {
          setUser(nextUser);
          setPage('home');
        }}
        onLogout={() => {
          setUser(null);
          setPage('home');
        }}
      />
      {page === 'home' && !user && <HomePage onLogin={(nextUser) => setUser(nextUser)} setPage={setPage} />}
      {page === 'home' && user?.role === 'student' && (
        <StudentDashboard user={user} activeView={dashboardView} setActiveView={setPage} />
      )}
      {page === 'home' && user?.role === 'teacher' && <TeacherDashboard user={user} />}
      {page !== 'home' && (
        <PublicPage
          page={page}
          user={user}
          setPage={setPage}
          onAuthSuccess={(nextUser) => {
            setUser(nextUser);
            setPage('home');
          }}
          dashboardView={dashboardView}
        />
      )}
      <AskVriddhiBot />
    </main>
  );
}

function Header({
  user,
  page,
  setPage,
  onAuthSuccess,
  onLogout,
}: {
  user: User | null;
  page: Page;
  setPage: (page: Page) => void;
  onAuthSuccess: (user: User) => void;
  onLogout: () => void;
}) {
  return (
    <header className="site-header">
      <button className="brand brand-button" onClick={() => setPage('home')}>
        <span className="brand-mark">AV</span>
        <span>AdVriddhi</span>
      </button>
      <nav className="nav-links" aria-label="Primary navigation">
        <button className={page === 'about' ? 'active' : ''} onClick={() => setPage('about')}>About</button>
        <button className={page === 'courses' ? 'active' : ''} onClick={() => setPage('courses')}>
          Courses
        </button>
        <button className={page === 'recorded' ? 'active' : ''} onClick={() => setPage('recorded')}>
          Recorded
        </button>
        <button className={page === 'live' ? 'active' : ''} onClick={() => setPage('live')}>
          Live Classes
        </button>
        <button className={page === 'downloads' ? 'active' : ''} onClick={() => setPage('downloads')}>Downloads</button>
        <button className={page === 'blog' ? 'active' : ''} onClick={() => setPage('blog')}>Blog</button>
        <button className={page === 'pyq' ? 'active' : ''} onClick={() => setPage('pyq')}>PYQ Vriddhi</button>
        <button className={page === 'campus' ? 'active' : ''} onClick={() => setPage('campus')}>Campus Vriddhi</button>
        <button className={page === 'daily' ? 'active' : ''} onClick={() => setPage('daily')}>Daily Vriddhi</button>
      </nav>
      {user ? (
        <div className="user-pill">
          <UserRound size={18} />
          <span>{user.name}</span>
          <button className="icon-button" aria-label="Logout" onClick={onLogout}>
            <LogOut size={18} />
          </button>
        </div>
      ) : (
        <button className="login-link" onClick={() => setPage('auth')}>
          Login/Register
        </button>
      )}
    </header>
  );
}

function Landing({ onLogin, setPage }: { onLogin: (user: User) => void; setPage: (page: Page) => void }) {
  return (
    <>
      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={16} /> UPSC focused AI learning ecosystem
          </span>
          <h1 className="hero-slogan">
            <span>From Classroom</span>
            <span>to Collectorate</span>
          </h1>
          <p className="hero-platform-note">
            AdVriddhi is an AI Powered, Trusted & Affordable Learning Platform.
          </p>
          <p className="hero-support-copy">
            Live UPSC classes, recorded GS lectures, AI-guided current affairs, answer writing
            practice, test analytics and personalized dashboards for every civil services aspirant.
          </p>
          <div className="hero-actions">
            <a href="#login" className="primary-button">
              Get Started <ChevronRight size={18} />
            </a>
            <button type="button" className="secondary-button" onClick={() => setPage('courses')}>
              Explore Courses
            </button>
          </div>
        </div>
        <div className="hero-media">
          <img src={heroImage} alt="Students studying online" />
          <div className="live-chip">
            <Radio size={18} /> AI Live now: Prelims Polity Booster
          </div>
        </div>
      </section>

      <section className="stats-strip" id="features">
        {courseStats.map(([value, label]) => (
          <article key={value}>
            <CheckCircle2 size={22} />
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="ai-feature-band">
        <div className="ai-feature-heading">
          <span className="section-kicker">Built for Smarter Learning</span>
          <h2>AI support for Prelims, Mains and Interview preparation</h2>
        </div>
        <div className="ai-feature-grid">
          {aiFeatures.map(([title, description]) => (
            <article key={title}>
              <Sparkles size={20} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="score-vriddhi-section" id="pyq-vriddhi">
        <div className="score-hero">
          <span className="section-kicker">AI Test Series • UPSC Prelims</span>
          <h2>Score Vriddhi</h2>
          <p>More than just a quiz app, Score Vriddhi is a complete Prelims preparation engine.</p>
        </div>
        <div className="score-grid">
          {scoreVriddhiFeatures.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <div className="score-steps">
          <h3>How to Get Started</h3>
          <div>
            {scoreVriddhiSteps.map(([step, title, description]) => (
              <article key={step}>
                <span>STEP {step}</span>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="exam-info-section">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">UPSC Exam Essentials</span>
            <h2>Eligibility, attempts, fee and official exam context</h2>
          </div>
        </div>
        <div className="exam-info-grid">
          {examInfoCards.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="syllabus-section">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">Syllabus Vriddhi</span>
            <h2>Prelims and Mains syllabus highlights</h2>
          </div>
        </div>
        <div className="syllabus-grid">
          {syllabusHighlights.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="resource-section">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">AdVriddhi Resources</span>
            <h2>Everything an aspirant checks every day</h2>
          </div>
        </div>
        <div className="resource-grid">
          {resourceLinks.map(([id, title, description]) => (
            <article id={id} key={id}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

    </>
  );
}

function PublicPage({
  page,
  user,
  setPage,
  onAuthSuccess,
  dashboardView,
}: {
  page: Page;
  user: User | null;
  setPage: (page: Page) => void;
  onAuthSuccess: (user: User) => void;
  dashboardView: 'home' | 'recorded' | 'live';
}) {
  if (user?.role === 'student' && (page === 'recorded' || page === 'live')) {
    return <StudentDashboard user={user} activeView={dashboardView} setActiveView={setPage} />;
  }

  switch (page) {
    case 'about':
      return <AboutPage />;
    case 'courses':
      return <CoursesPage />;
    case 'downloads':
      return <DownloadsPage />;
    case 'blog':
      return <BlogPage />;
    case 'pyq':
      return <PyqVriddhiPage />;
    case 'campus':
      return <CampusVriddhiPage />;
    case 'daily':
      return <DailyVriddhiPage />;
    case 'auth':
      return <AuthPage onAuthSuccess={onAuthSuccess} />;
    case 'recorded':
      return <RecordedPage />;
    case 'live':
      return <LiveClassesPage />;
    default:
      return <HomePage onLogin={() => undefined} setPage={setPage} />;
  }
}

function AuthPage({ onAuthSuccess }: { onAuthSuccess: (user: User) => void }) {
  return (
    <>
      <PageHero
        kicker="Login / Signup"
        title="Continue your AdVriddhi UPSC journey"
        description="Login as a student or teacher, or create a new account to enroll in UPSC batches and access live classes, recorded lectures and AI learning tools."
      />
      <AuthPanel onAuthSuccess={onAuthSuccess} variant="page" />
    </>
  );
}

function HomePage({ onLogin, setPage }: { onLogin: (user: User) => void; setPage: (page: Page) => void }) {
  return (
    <>
      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={16} /> UPSC focused AI learning ecosystem
          </span>
          <h1 className="hero-slogan">
            <span>From Classroom</span>
            <span>to Collectorate</span>
          </h1>
          <p className="hero-platform-note">
            AdVriddhi is an AI Powered, Trusted & Affordable Learning Platform.
          </p>
          <p className="hero-support-copy">
            Live UPSC classes, recorded GS lectures, AI-guided current affairs, answer writing
            practice, test analytics and personalized dashboards for every civil services aspirant.
          </p>
          <div className="hero-actions">
            <a href="#login" className="primary-button">
              Get Started <ChevronRight size={18} />
            </a>
            <button type="button" className="secondary-button" onClick={() => setPage('courses')}>
              Explore Courses
            </button>
          </div>
        </div>
        <div className="hero-media">
          <img src={heroImage} alt="Students studying online" />
          <div className="live-chip">
            <Radio size={18} /> AI Live now: Prelims Polity Booster
          </div>
        </div>
      </section>

      <section className="stats-strip" id="features">
        {courseStats.map(([value, label]) => (
          <article key={value}>
            <CheckCircle2 size={22} />
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="ai-feature-band">
        <div className="ai-feature-heading">
          <span className="section-kicker">Built for Smarter Learning</span>
          <h2>AI support for Prelims, Mains and Interview preparation</h2>
        </div>
        <div className="ai-feature-grid">
          {aiFeatures.map(([title, description]) => (
            <article key={title}>
              <Sparkles size={20} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <AuthPanel onAuthSuccess={onLogin} />
    </>
  );
}

function PageHero({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return (
    <section className="page-hero">
      <span className="section-kicker">{kicker}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About AdVriddhi"
        title="IAS Masterpiece in India"
        description="AdVriddhi is a comprehensive platform for UPSC Civil Services Examination preparation, combining structured programs, expert guidance and personalized learning paths."
      />
      <section className="legacy-section">
        <div className="legacy-grid">
          {legacyHighlights.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="exam-info-section">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">UPSC Exam Essentials</span>
            <h2>Eligibility, attempts, fee and official context</h2>
          </div>
        </div>
        <div className="exam-info-grid">
          {examInfoCards.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function CoursesPage() {
  return (
    <>
      <PageHero
        kicker="Courses"
        title="UPSC preparation powered by live teaching and intelligent study support"
        description="Cover GS, CSAT, optional subjects, current affairs, answer writing, Prelims test series, Mains evaluation and interview mentorship in one responsive learning interface."
      />
      <section className="split-section">
        <div>
          <span className="section-kicker">AI Ed-Tech Platform</span>
          <h2>Programs for every stage of the civil services journey</h2>
          <p>Choose an integrated foundation program or focused modules for Prelims, Mains, CSAT, optional subjects and interview guidance.</p>
        </div>
        <div className="category-grid">
          {['UPSC GS Foundation', 'Prelims Test Series', 'Mains Answer Writing', 'CSAT', 'Optional Subjects', 'Interview Guidance'].map((category) => (
            <button key={category}>{category}</button>
          ))}
        </div>
      </section>
      <section className="upsc-track-section">
        <div className="upsc-track-grid">
          {upscTracks.map(([title, description]) => (
            <article key={title}>
              <BookOpen size={20} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="syllabus-section">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">Syllabus Vriddhi</span>
            <h2>Prelims and Mains syllabus highlights</h2>
          </div>
        </div>
        <div className="syllabus-grid">
          {syllabusHighlights.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function DownloadsPage() {
  const downloads = [
    ['UPSC Weekly Planner', 'A weekly checklist for GS, CSAT, current affairs, answer writing and revision.'],
    ['Monthly Current Affairs PDF', 'A concise monthly magazine-style resource for national and international issues.'],
    ['Syllabus Tracker', 'Mark topics as done, revising or weak across Prelims and Mains papers.'],
    ['Answer Writing Template', 'Structured formats for intro, body, conclusion, examples and value-add points.'],
  ];

  return (
    <>
      <PageHero kicker="Downloads" title="Study resources ready for revision" description="Downloadable planners, trackers, PDFs and templates for disciplined UPSC preparation." />
      <section className="resource-section">
        <div className="resource-grid">
          {downloads.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
              <button className="secondary-button">Download</button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function BlogPage() {
  const posts = [
    ['How to Start UPSC Preparation from Zero', 'Build the right foundation with NCERTs, syllabus mapping, current affairs and PYQ analysis.'],
    ['Prelims Strategy: Accuracy Before Attempts', 'Use elimination, topic-wise practice and mock analysis to improve your net score.'],
    ['Mains Answer Writing Framework', 'Learn how to structure answers with clarity, examples, diagrams, committees and constitutional keywords.'],
    ['Interview Preparation with DAF', 'Convert your background, hobbies and service preference into mature interview talking points.'],
  ];

  return (
    <>
      <PageHero kicker="Blog" title="UPSC strategy notes for serious aspirants" description="Focused articles on Prelims, Mains, optional subjects, current affairs, mentorship and interview preparation." />
      <section className="resource-section">
        <div className="resource-grid">
          {posts.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function PyqVriddhiPage() {
  return (
    <>
      <PageHero kicker="PYQ Vriddhi" title="Previous years, AI practice and Score Vriddhi in one place" description="Practice UPSC pattern questions, analyze weak areas and convert PYQs into smarter revision cycles." />
      <section className="score-vriddhi-section">
        <div className="score-hero">
          <span className="section-kicker">AI Test Series | UPSC Prelims</span>
          <h2>Score Vriddhi</h2>
          <p>More than just a quiz app, Score Vriddhi is a complete Prelims preparation engine.</p>
        </div>
        <div className="score-grid">
          {scoreVriddhiFeatures.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <div className="score-steps">
          <h3>How to Get Started</h3>
          <div>
            {scoreVriddhiSteps.map(([step, title, description]) => (
              <article key={step}>
                <span>STEP {step}</span>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CampusVriddhiPage() {
  const campusItems = [
    ['Bangalore Learning Hub', 'Hybrid classroom programs at Nagarbhavi, Bengaluru for guided UPSC preparation.'],
    ['Mentorship Circles', 'Small-group sessions for strategy correction, timetable discipline and accountability.'],
    ['Answer Writing Workshops', 'Offline and online writing labs for GS, Essay and Ethics improvement.'],
    ['Interview Practice Rooms', 'DAF discussions, personality mentoring and mock board readiness.'],
  ];

  return (
    <>
      <PageHero kicker="Campus Vriddhi" title="A focused UPSC learning environment" description="Campus Vriddhi brings classroom discipline, mentorship, hybrid learning and peer momentum into the AdVriddhi ecosystem." />
      <section className="resource-section">
        <div className="resource-grid">
          {campusItems.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function DailyVriddhiPage() {
  const dailyItems = [
    ['Daily Current Affairs', 'National, international, economy, environment, S&T and polity updates curated for UPSC relevance.'],
    ['Editorial Briefs', 'Concise summaries with issue background, arguments, data points and Mains-ready dimensions.'],
    ['Daily Quiz', 'Short MCQ practice to test retention and improve Prelims accuracy.'],
    ['AI Revision Tasks', 'Personalized prompts that convert daily learning into spaced revision.'],
  ];

  return (
    <>
      <PageHero kicker="Daily Vriddhi" title="Daily UPSC discipline, simplified" description="Daily Vriddhi helps aspirants stay consistent with current affairs, editorials, quizzes and AI-curated revision tasks." />
      <section className="resource-section">
        <div className="resource-grid">
          {dailyItems.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function RecordedPage() {
  return (
    <>
      <PageHero kicker="Recorded Lectures" title="UPSC lecture library for registered batches" description="Browse recorded GS, current affairs and answer writing classes while backend enrollment APIs are added later." />
      <section className="dashboard-shell public-content-shell">
        <RecordedGrid lectures={demoLectures} />
      </section>
    </>
  );
}

function LiveClassesPage() {
  const [selectedLive, setSelectedLive] = useState<LiveClass | null>(null);
  const liveClass = selectedLive ?? demoLiveClasses[0];

  return (
    <>
      <PageHero kicker="Live Classes" title="Attend live UPSC classes with dummy video preview" description="Students can join live sessions, preview upcoming classes and later connect this page to your real video API." />
      <section className="dashboard-shell public-content-shell">
        <LiveClassRoom liveClass={liveClass} liveClasses={demoLiveClasses} onSelect={setSelectedLive} />
      </section>
    </>
  );
}

function AskVriddhiBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste, I am Ask Vriddhi. Ask me about UPSC courses, PYQs, Daily Vriddhi, live classes or enrollment.',
    },
  ]);

  const quickReplies = ['Courses', 'PYQ Vriddhi', 'Daily Vriddhi'];

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setLoading(true);
    const reply = await fakeApi.askVriddhi(trimmed);
    setMessages((current) => [
      ...current,
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply,
      },
    ]);
    setLoading(false);
  };

  return (
    <div className={`chat-widget ${open ? 'open' : ''}`}>
      {open && (
        <section className="chat-panel" role="dialog" aria-label="Ask Vriddhi chatbot">
          <header className="chat-header">
            <div>
              <span>Ask Vriddhi</span>
              <small>AI UPSC assistant</small>
            </div>
            <button type="button" aria-label="Close Ask Vriddhi" onClick={() => setOpen(false)}>
              ×
            </button>
          </header>

          <div className="chat-messages" aria-live="polite">
            {messages.map((message) => (
              <div className={`chat-bubble ${message.sender}`} key={message.id}>
                {message.text}
              </div>
            ))}
            {loading && <div className="chat-bubble bot typing">Ask Vriddhi is typing...</div>}
          </div>

          <div className="chat-quick-replies">
            {quickReplies.map((reply) => (
              <button type="button" key={reply} onClick={() => sendMessage(reply)}>
                {reply}
              </button>
            ))}
          </div>

          <form
            className="chat-input-row"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about UPSC preparation..."
              aria-label="Ask Vriddhi message"
            />
            <button type="submit" aria-label="Send message" disabled={loading || !input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chat-launcher"
        aria-label={open ? 'Close Ask Vriddhi' : 'Open Ask Vriddhi'}
        onClick={() => setOpen((current) => !current)}
      >
        <MessageCircle size={22} />
        <span>Ask Vriddhi</span>
      </button>
    </div>
  );
}

function AuthPanel({
  onAuthSuccess,
  variant = 'home',
}: {
  onAuthSuccess: (user: User) => void;
  variant?: 'home' | 'page';
}) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<Role>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [batch, setBatch] = useState('UPSC CSE Foundation 2027');
  const [loading, setLoading] = useState(false);

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const nextUser =
      mode === 'login'
        ? await fakeApi.login(role, name)
        : await fakeApi.signup(role, name, batch);
    setLoading(false);
    onAuthSuccess(nextUser);
  };

  return (
    <section className={`login-section ${variant === 'page' ? 'auth-page-section' : ''}`} id="login">
      <form className="login-card" onSubmit={submitLogin}>
        <span className="section-kicker">{mode === 'login' ? 'Login' : 'Signup'}</span>
        <h2>{mode === 'login' ? 'Welcome back to AdVriddhi' : 'Join AdVriddhi'}</h2>
        <div className="role-toggle" aria-label="Choose role">
          <button
            type="button"
            className={role === 'student' ? 'selected' : ''}
            onClick={() => {
              setRole('student');
              setBatch('UPSC CSE Foundation 2027');
            }}
          >
            <GraduationCap size={18} /> Student
          </button>
          <button
            type="button"
            className={role === 'teacher' ? 'selected' : ''}
            onClick={() => {
              setRole('teacher');
              setBatch('UPSC GS Faculty');
            }}
          >
            <ShieldCheck size={18} /> Teacher
          </button>
        </div>
        <label>
          {mode === 'login' ? 'Name or email' : 'Full name'}
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={mode === 'login' ? 'Enter name or email' : 'Enter full name'}
          />
        </label>
        {mode === 'signup' && (
          <>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
              />
            </label>
            <label>
              {role === 'student' ? 'Enroll for batch' : 'Teaching program'}
              <select value={batch} onChange={(event) => setBatch(event.target.value)}>
                {role === 'student' ? (
                  <>
                    <option>UPSC CSE Foundation 2027</option>
                    <option>Prelims 2026 Booster</option>
                    <option>Mains Answer Writing Program</option>
                    <option>Current Affairs + CSAT Batch</option>
                  </>
                ) : (
                  <>
                    <option>UPSC GS Faculty</option>
                    <option>Current Affairs Faculty</option>
                    <option>Optional Subject Faculty</option>
                    <option>Interview Mentorship Panel</option>
                  </>
                )}
              </select>
            </label>
          </>
        )}
        <label>
          Password
          <input type="password" placeholder={mode === 'login' ? 'Enter password' : 'Create password'} />
        </label>
        {mode === 'signup' && (
          <label>
            Confirm password
            <input type="password" placeholder="Confirm password" />
          </label>
        )}
        <button className="primary-button wide" disabled={loading}>
          {loading
            ? mode === 'login'
              ? 'Signing in...'
              : 'Creating account...'
            : mode === 'login'
              ? 'Login'
              : 'Signup and Enroll'}
        </button>
        <p className="auth-switch">
          {mode === 'login' ? 'New user?' : 'Already registered?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setLoading(false);
            }}
          >
            {mode === 'login' ? 'Signup' : 'Login'}
          </button>
        </p>
      </form>
      {variant === 'home' && (
        <aside className="login-art">
          <img src={teacherImage} alt="Teacher leading class" />
        </aside>
      )}
    </section>
  );
}

function StudentDashboard({
  user,
  activeView,
  setActiveView,
}: {
  user: User;
  activeView: string;
  setActiveView: (view: 'home' | 'recorded' | 'live') => void;
}) {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [selectedLive, setSelectedLive] = useState<LiveClass | null>(null);

  useEffect(() => {
    fakeApi.getLectures().then(setLectures);
    fakeApi.getLiveClasses().then(setLiveClasses);
  }, []);

  const liveClass = selectedLive ?? liveClasses[0];

  return (
    <section className="dashboard-shell">
      <DashboardIntro user={user} />

      <div className="dashboard-tabs">
        <button className={activeView === 'home' ? 'selected' : ''} onClick={() => setActiveView('home')}>
          <LayoutDashboard size={18} /> Overview
        </button>
        <button className={activeView === 'recorded' ? 'selected' : ''} onClick={() => setActiveView('recorded')}>
          <MonitorPlay size={18} /> Recorded Lectures
        </button>
        <button className={activeView === 'live' ? 'selected' : ''} onClick={() => setActiveView('live')}>
          <Radio size={18} /> Attend Live
        </button>
      </div>

      {activeView === 'live' ? (
        <LiveClassRoom liveClass={liveClass} liveClasses={liveClasses} onSelect={setSelectedLive} />
      ) : (
        <>
          <section className="panel-heading">
            <div>
              <span className="section-kicker">Registered Batch</span>
              <h2>{user.batch} AI-recommended UPSC lecture library</h2>
            </div>
            <div className="search-box">
              <Search size={18} />
              <input placeholder="Search recorded class" />
            </div>
          </section>
          <RecordedGrid lectures={lectures} />
        </>
      )}
    </section>
  );
}

function DashboardIntro({ user }: { user: User }) {
  return (
    <section className="dashboard-hero">
      <div>
        <span className="eyebrow">
          <BookOpen size={16} /> {user.batch}
        </span>
        <h1>Welcome back, {user.name}</h1>
        <p>Attend UPSC live classes, revise GS recordings and follow AI-guided next steps for Prelims and Mains.</p>
      </div>
      <div className="schedule-card">
        <CalendarClock size={24} />
        <span>Next live class</span>
        <strong>Today, 7:00 PM</strong>
      </div>
    </section>
  );
}

function RecordedGrid({ lectures }: { lectures: Lecture[] }) {
  return (
    <div className="lecture-grid">
      {lectures.map((lecture) => (
        <article className="lecture-card" key={lecture.id}>
          <img src={lecture.thumbnail} alt={lecture.title} />
          <div className="lecture-body">
            <span className="subject-badge">{lecture.subject}</span>
            <h3>{lecture.title}</h3>
            <p>{lecture.teacher} • {lecture.tag}</p>
            <div className="lecture-meta">
              <span>
                <Clock size={16} /> {lecture.duration}
              </span>
              <button>
                <PlayCircle size={17} /> Watch
              </button>
            </div>
            <div className="progress-bar">
              <span style={{ width: `${lecture.watched}%` }} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function LiveClassRoom({
  liveClass,
  liveClasses,
  onSelect,
}: {
  liveClass?: LiveClass;
  liveClasses: LiveClass[];
  onSelect: (liveClass: LiveClass) => void;
}) {
  return (
    <section className="classroom-layout">
      <div className="video-panel">
        <video
          controls
          autoPlay
          muted
          loop
          poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        />
        <div className="video-caption">
          <span className="live-dot">Live</span>
          <h2>{liveClass?.title ?? 'Loading live class...'}</h2>
          <p>{liveClass?.teacher} • {liveClass?.subject}</p>
        </div>
      </div>
      <aside className="class-sidebar">
        <h3>Available live classes</h3>
        {liveClasses.map((item) => (
          <button className="live-list-item" key={item.id} onClick={() => onSelect(item)}>
            <span>{item.status}</span>
            <strong>{item.title}</strong>
            <small>{item.startsAt} • {item.attendees.toLocaleString()} students</small>
          </button>
        ))}
      </aside>
    </section>
  );
}

function TeacherDashboard({ user }: { user: User }) {
  const [topic, setTopic] = useState('Indian Polity: Parliament, Federalism and PYQ Analysis');
  const [starting, setStarting] = useState(false);
  const [meetingId, setMeetingId] = useState<string | null>(null);

  const startClass = async () => {
    setStarting(true);
    const response = await fakeApi.startClass();
    setMeetingId(response.meetingId);
    setStarting(false);
  };

  const upcoming = useMemo(() => demoLiveClasses.concat({
    id: 4,
    title: topic,
    subject: 'GS Paper II',
    teacher: user.name,
    startsAt: 'Draft',
    status: 'Upcoming',
    attendees: 0,
  }), [topic, user.name]);

  return (
    <section className="dashboard-shell">
      <section className="dashboard-hero teacher">
        <div>
          <span className="eyebrow">
            <Users size={16} /> Teacher Console
          </span>
          <h1>Start and manage your AI-assisted live class</h1>
          <p>Create a UPSC session, preview the classroom and publish it with syllabus tags, PYQs and smart learning context.</p>
        </div>
        <div className="schedule-card">
          <Video size={24} />
          <span>Studio status</span>
          <strong>{meetingId ? 'Class is live' : 'Ready'}</strong>
        </div>
      </section>

      <section className="teacher-grid">
        <form className="studio-card" onSubmit={(event) => event.preventDefault()}>
          <span className="section-kicker">Live Studio</span>
          <h2>Class setup</h2>
          <label>
            Topic
            <input value={topic} onChange={(event) => setTopic(event.target.value)} />
          </label>
          <label>
            Batch
            <select>
              <option>UPSC CSE Foundation 2027</option>
              <option>Prelims 2026 Booster</option>
              <option>Mains Answer Writing Program</option>
            </select>
          </label>
          <div className="studio-actions">
            <button type="button" className="secondary-button">
              <Mic size={18} /> Test Mic
            </button>
            <button type="button" className="primary-button" onClick={startClass} disabled={starting}>
              <Radio size={18} /> {starting ? 'Starting...' : 'Start Live Class'}
            </button>
          </div>
          {meetingId && <p className="success-note">Dummy API created meeting {meetingId}. Students can now join.</p>}
        </form>

        <div className="teacher-preview">
          <video
            controls
            muted
            loop
            poster="https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1200&q=80"
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          />
          <h3>{topic}</h3>
          <p>Preview stream with dummy video. Add AI summaries, attendance insights or your live SDK later.</p>
        </div>
      </section>

      <section className="panel-heading">
        <div>
          <span className="section-kicker">Schedule</span>
          <h2>Live class queue</h2>
        </div>
      </section>
      <div className="queue-list">
        {upcoming.map((item) => (
          <article key={item.id}>
            <span>{item.status}</span>
            <strong>{item.title}</strong>
            <small>{item.startsAt} • {item.subject}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export default App;
