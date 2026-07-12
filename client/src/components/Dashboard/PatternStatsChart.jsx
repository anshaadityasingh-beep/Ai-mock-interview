import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const PatternStatsChart = ({ stats }) => {
  // stats is an object like: { "two pointers": 12, "sliding window": 8 }
  const data = Object.keys(stats).map((key) => ({
    pattern: key,
    solved: stats[key],
  }));

  if (data.length === 0) {
    return <p className="empty-stats-text">No stats available. Log problems to see your pattern distribution.</p>;
  }

  return (
    <div className="pattern-stats-chart-container">
      <h3>Problems Solved by Pattern</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis dataKey="pattern" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="solved" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PatternStatsChart;
