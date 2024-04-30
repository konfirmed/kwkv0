// app/components/debug-header-item.tsx

// Import necessary modules
import React, { useState } from 'react';

// Define types for props
interface HeaderItem {
  tagName: string;
  attributes: Attribute[];
}

interface Attribute {
  name: string;
  value: string;
}

interface Props {
  title: string;
  headers: HeaderItem[];
}

// DebugHeaderItem component
const DebugHeaderItem: React.FC<Props> = ({ title, headers }) => {
  // State to track expanded attribute index
  const [expandedAttribute, setExpandedAttribute] = useState<string | null>(null);

  // Function to render attributes
  const renderAttributes = (attributes: Attribute[], headerIndex: number) => {
    if (!attributes || attributes.length === 0) {
      return <p>No attributes found.</p>;
    }

    // Function to toggle attribute expansion
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
          const displayValue =
            isExpanded ? attr.value : attr.value.substring(0, 50) + (attr.value.length > 50 ? '...' : '');

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

  // Function to render each header item
  const renderHeaderItem = (item: HeaderItem, index: number) => {
    // Unique key using both tagName and index
    const uniqueKey = `${item.tagName}-${index}`;

    return (
      <div key={uniqueKey}>
        <p>Tag Name: {item.tagName}</p>
        <div>
          <p>Attributes:</p>
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

export default DebugHeaderItem;
