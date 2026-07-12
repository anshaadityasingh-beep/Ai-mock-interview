import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ReadinessChart = ({ stats }) => {
  // Convert stats object { DSA: 72, OS: 60 } to array of objects for Recharts
  const data = Object.keys(stats).map((key) => ({
    category: key,
    readiness: stats[key],
  }));

  return (
    <div className="readiness-chart-container">
      <h3>Category Readiness (%)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis domain={[0, 100]} />
            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            <Bar dataKey="readiness" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReadinessChart;
