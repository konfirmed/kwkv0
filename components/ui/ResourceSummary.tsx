import React from 'react';
import styles from 'app/ui/ResourceSummary.module.css';

interface ResourceItemProps {
  name: string;
  value: string;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ name, value }) => {
  return (
    <div className={styles.resourceItem}>
      <div className={styles.resourceName}>
        <strong>{name}</strong>
      </div>
      <div className={styles.resourceValue}>{value}</div>
    </div>
  );
};

export const ResourceSummary: React.FC = () => {
  // Placeholder values for demonstration
  const resourceItems = [
    { name: 'Document', value: '0' },
    { name: 'JavaScript', value: '0' },
    { name: 'Fonts', value: '0' },
    { name: 'CSS', value: '0' },
    { name: 'Media', value: '0' },
    { name: 'Third Party', value: '0' },
    { name: 'Images', value: '0' },
    { name: 'Other', value: '0' },
  ];

  return (
    <div className={styles.resourceSummary}>
      {resourceItems.map(resource => (
        <ResourceItem key={resource.name} name={resource.name} value={resource.value} />
      ))}
    </div>
  );
};