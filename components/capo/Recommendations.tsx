import React from 'react';
import styles from 'app/ui/capo/Recommendations.module.css';

interface HeaderElement {
  tagName: string;
  attributes: Array<{ name: string; value: string }>;
}

interface RecommendationsProps {
  originalElements: HeaderElement[];
  sortedElements: HeaderElement[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ originalElements, sortedElements }) => {

  const formatHeaderElement = (element: HeaderElement): string => {
    const attributes = element.attributes.map(attr => `${attr.name}="${attr.value}"`).join(' ');
    return `<${element.tagName} ${attributes}></${element.tagName}>`;
  };

  const generateOrderRecommendations = () => {
    const recommendations: string[] = [];
    
    originalElements.forEach((element, index) => {
      const correctElement = sortedElements[index];
      if (element.tagName !== correctElement.tagName || JSON.stringify(element.attributes) !== JSON.stringify(correctElement.attributes)) {
        recommendations.push(`Element at position ${index + 1} should be ${formatHeaderElement(correctElement)} but found ${formatHeaderElement(element)}`);
      }
    });

    return recommendations;
  };

  const orderRecommendations = generateOrderRecommendations();

  return (
    <div className={styles.recommendations}>
      <h2>Recommendations</h2>
      <ul className={styles.recommendationsList}>
        {orderRecommendations.length > 0 ? (
          orderRecommendations.map((rec, index) => <li key={index} className={styles.recommendationsItem}>{rec}</li>)
        ) : (
          <li>No recommendations available</li>
        )}
      </ul>
    </div>
  );
};

export default Recommendations;