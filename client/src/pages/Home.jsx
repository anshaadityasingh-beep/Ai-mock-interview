import { Link } from 'react-router-dom';

const features = [
  '🧠 AI-Driven Interviews',
  '📚 DSA + CS Fundamentals',
  '📊 Performance Dashboard',
  '🎯 5-Rubric Scoring',
  '💬 Conversational Format',
  '📝 Manual Problem Log',
];

const Home = () => {
  return (
    <div className="home-page">
      <span className="home-badge">✨ AI-Powered Interview Prep</span>

      <h1 className="home-title">
        Ace Your Tech Interview<br />with AI Mock Sessions
      </h1>

      <p className="home-subtitle">
        Practice DSA and CS fundamentals (OS, DBMS, CN, OOP) with an AI interviewer
        that asks real follow-up questions, evaluates your depth, and gives structured feedback — all in one place.
      </p>

      <div className="home-features">
        {features.map((f) => (
          <span key={f} className="home-feature-pill">{f}</span>
        ))}
      </div>

      <Link to="/login">
        <button id="home-get-started-btn" className="start-btn large-btn">
          Get Started — It's Free
        </button>
      </Link>
    </div>
  );
};

export default Home;
