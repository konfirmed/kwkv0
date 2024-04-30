/* eslint-disable max-len */
import puppeteer, { Page } from 'puppeteer';

interface ElementData {
  tagName: string;
  attributes: { name: string; value: string }[];
}

interface WeightedElementData extends ElementData {
  weight: number;
}

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

export const getWeight = (tagName: string): number => {
  return ElementWeights[tagName as keyof typeof ElementWeights] || 0;
};

export const analyzeHeadElements = async (page: Page): Promise<ElementData[]> => {
  return await page.$$eval('head > *', (nodes: Element[]) => nodes.map((node: Element) => ({
    tagName: node.tagName,
    attributes: Array.from(node.attributes).map((attr: Attr) => ({ name: attr.name, value: attr.value })),
  })));
};

export const sortElementsByWeight = (elements: ElementData[]): WeightedElementData[] => {
  const elementsWithWeight: WeightedElementData[] = elements.map(({ tagName, attributes }) => ({
    tagName,
    attributes,
    weight: getWeight(tagName),
  }));

  const sortedElements: WeightedElementData[] = elementsWithWeight.sort((a: WeightedElementData, b: WeightedElementData) => b.weight - a.weight);

  return sortedElements;
};

export const analyzeHead = async (htmlContent: string): Promise<{ originalElements: ElementData[]; sortedElements: WeightedElementData[] }> => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    
    const elements = await analyzeHeadElements(page);
    const originalElements = elements;
    const sortedElements = sortElementsByWeight(elements);

    await browser.close();

    return { originalElements, sortedElements };
  } catch (err) {
    console.error('Error occurred in analyzeHead:', err);
    return { originalElements: [], sortedElements: [] };
  }
};