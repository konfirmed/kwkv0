'use client';
import React, { useState } from 'react';

interface Attribute {
  name: string;
  value: string;
}

interface HeaderItem {
  tagName: string;
  attributes: Attribute[];
}

interface DebugHeaderItemProps {
  title: string;
  headers: HeaderItem[];
}

export const DebugHeaderItem: React.FC<DebugHeaderItemProps> = ({ title, headers }) => {
  const [expandedAttribute, setExpandedAttribute] = useState<string | null>(null);

  const renderAttributes = (attributes: Attribute[], headerIndex: number) => {
    if (!attributes || attributes.length === 0) {
      return <p>No attributes found.</p>;
    }

    const toggleAttribute = (index: number) => {
      if (expandedAttribute === `${headerIndex}-${index}`) {
        setExpandedAttribute(null); // Collapse if it's already expanded
      } else {
        setExpandedAttribute(`${headerIndex}-${index}`); // Expand the clicked one
      }
    };

    return (
      <ul>
        {attributes.map((attr, index) => {
          const isExpanded = expandedAttribute === `${headerIndex}-${index}`;
          const displayValue = isExpanded ? attr.value : attr.value.substring(0, 50) + (attr.value.length > 50 ? '...' : '');
          
          return (
            <li key={index}>
              {attr.name}: {displayValue}
              {attr.value.length > 50 && (
                <button onClick={() => toggleAttribute(index)} style={{ marginLeft: '10px' }}>
                  {isExpanded ? 'Less' : 'More'}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderHeaderItem = (item: HeaderItem, index: number) => {
    // Unique key using both tagName and index
    const uniqueKey = `${item.tagName}-${index}`;

    return (
      <div key={uniqueKey} style={{ /* your styles here */ }}>
        <p style={{ fontWeight: 'bold' }}>Tag Name: {item.tagName}</p>
        <div>
          <p style={{ fontStyle: 'italic' }}>Attributes:</p>
          {renderAttributes(item.attributes, index)}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h4>{title}:</h4>
      <div className='headers'>
        {headers && headers.length > 0 ? (
          headers.map((item, index) => renderHeaderItem(item, index))
        ) : (
          <p>No headers found.</p>
        )}
      </div>
    </div>
  );
};