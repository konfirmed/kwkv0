// app/lib/capo.ts

// Import the necessary modules
import { JSDOM } from 'jsdom';

// Define weights for different head elements
const ElementWeights: Record<string, number> = {
  META: 10,
  TITLE: 9,
  LINK: 8,
  SCRIPT: 7,
  STYLE: 6,
  BASE: 5,
  NOSCRIPT: 4,
  PRELOAD: 3,
  DEFER_SCRIPT: 2,
  PREFETCH_PRERENDER: 1,
  OTHER: 0,
};

// Function to determine the weight of a given head element
const getWeight = (element: Element): number => {
  const tagName = element.tagName.toUpperCase();
  // Get the weight of the element from the predefined weights, or default to 0 if not found
  return ElementWeights[tagName] || 0;
};

// Function to analyze the child elements of a given head element
export const analyzeHeadElements = (head: HTMLHeadElement): { tagName: string; attributes: { name: string; value: string }[] }[] => {
  if (!head || !head.children) {
    console.error('Head element or its children are not accessible');
    return [];
  }
  // Convert the HTMLCollection to an array and map each element to its tag name and attributes
  const elements = Array.from(head.children) as Element[];
  return elements.map((element) => ({
    tagName: element.tagName,
    attributes: Array.from(element.attributes).map((attr) => ({ name: attr.name, value: attr.value })),
  }));
};

// Function to sort elements by weight
export const sortElementsByWeight = (elements: { element: Element; weight: number }[]): { tagName: string; attributes: { name: string; value: string }[] }[] => {
  // Sort elements in descending order based on their weight
  return elements.sort((a, b) => b.weight - a.weight).map(({ element }) => ({
    tagName: element.tagName,
    attributes: Array.from(element.attributes).map((attr) => ({ name: attr.name, value: attr.value })),
  }));
};

// Main function to analyze the head
export const analyzeHead = (htmlContent: string): { originalElements: any[]; sortedElements: any[] } => {
  try {
    // Parse HTML content using JSDOM
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;

    // Check if the document and root element exist
    if (!doc || !doc.documentElement) {
      console.error('Failed to parse HTML document');
      return { originalElements: [], sortedElements: [] };
    }

    // Get the head element
    const head = doc.head;
    if (!head) {
      console.error('No head element found');
      return { originalElements: [], sortedElements: [] };
    }

    // Analyze the child elements of the head
    const elements = analyzeHeadElements(head);

    // Store original elements
    const originalElements = elements.map(({ tagName, attributes }) => ({ tagName, attributes }));

    // Sort elements by weight
    const sortedElements = sortElementsByWeight(
    elements.map(item => ({ element: item.tagName, weight: getWeight(item.tagName) }))
    ).map(({ element, weight }) => ({ tagName: element, attributes: [] }));
  


    // Return both original and sorted elements
    return { originalElements, sortedElements };
  } catch (error) {
    console.error('Error occurred in analyzeHead:', error);
    return { originalElements: [], sortedElements: [] };
  }
};
