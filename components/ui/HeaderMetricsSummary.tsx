import React from 'react';
import styles from 'app/ui/HeaderMetricsSummary.module.css';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => {
  return (
    <div className={styles.metricCard}>
      <h2>{title}</h2>
      <p>{value}</p>
      <small>{description}</small>
    </div>
  );
};

export const HeaderMetricsSummary: React.FC = () => {
  // Placeholder values for demonstration
  const metrics = [
    {
      title: 'Largest Contentful Paint',
      value: '0 ms',
      description: 'Measures the time taken for the largest content element in the viewport to become visible.',
    },
    {
      title: 'Interaction to Next Paint',
      value: '0 ms',
      description: 'Evaluates the responsiveness of a page by measuring the time from user interaction to the next paint.',
    },
    {
      title: 'Cumulative Layout Shift',
      value: '0',
      description: 'Quantifies how often users experience unexpected layout shifts during the lifespan of the page.',
    }
  ];

  return (
    <div className={styles.headerMetricsSummary}>
      {metrics.map(metric => (
        <MetricCard key={metric.title} title={metric.title} value={metric.value} description={metric.description} />
      ))}
    </div>
  );
};