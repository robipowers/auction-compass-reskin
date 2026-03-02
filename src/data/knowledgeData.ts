// Knowledge Base Data - Comprehensive AMT Articles
import { KnowledgeTopic, KnowledgeArticle, AMTGlossaryTerm } from '@/types/knowledge';
import { knowledgeArticles as amtArticles } from './amtKnowledgeArticles';

// Topics with icons matching the imported articles
export const mockTopics: (KnowledgeTopic & { articleCount: number })[] = [
  { id: 'fundamentals', name: 'Fundamentals', slug: 'fundamentals', icon: '📊', description: 'Core AMT concepts and auction process', sort_order: 1, created_at: '', articleCount: 0 },
  { id: 'value-area-poc', name: 'Value Area & POC', slug: 'value-area-poc', icon: '📈', description: 'Value area, POC, and trading strategies', sort_order: 2, created_at: '', articleCount: 0 },
  { id: 'balance-imbalance', name: 'Balance & Imbalance', slug: 'balance-imbalance', icon: '⚖️', description: 'Market balance states and transitions', sort_order: 3, created_at: '', articleCount: 0 },
  { id: 'initiative-responsive', name: 'Initiative & Responsive', slug: 'initiative-responsive', icon: '🎯', description: 'Trading activity types and participant behavior', sort_order: 4, created_at: '', articleCount: 0 },
  { id: 'inventory-risk', name: 'Inventory & Risk', slug: 'inventory-risk', icon: '📉', description: 'Position management and inventory', sort_order: 5, created_at: '', articleCount: 0 },
  { id: 'market-structure', name: 'Market Structure', slug: 'market-structure', icon: '🔄', description: 'Structural patterns and opening types', sort_order: 6, created_at: '', articleCount: 0 },
  { id: 'advanced-concepts', name: 'Advanced Concepts', slug: 'advanced-concepts', icon: '💡', description: 'Advanced strategies and techniques', sort_order: 7, created_at: '', articleCount: 0 },
];

// Create topics map for quick lookup
const topicsMap = new Map(mockTopics.map(t => [t.id, t]));

// Transform imported articles to match app format
export const mockArticles: KnowledgeArticle[] = amtArticles.map(article => ({
  ...article,
  topic: topicsMap.get(article.topic_id) || {
    id: article.topic_id,
    name: article.topic_id,
    slug: article.topic_id,
    icon: '📄',
    description: '',
    sort_order: 99,
    created_at: ''
  }
}));

// Update article counts
mockTopics.forEach(topic => {
  topic.articleCount = mockArticles.filter(a => a.topic_id === topic.id).length;
});

// Glossary terms extracted from articles
export const mockGlossary: AMTGlossaryTerm[] = [
  // Fundamentals
  { id: 'g1', term: 'Auction Market Theory', definition: 'A framework for understanding how markets function through continuous two-way auctions between buyers and sellers.', article_id: 'fundamentals-001', created_at: '' },
  { id: 'g2', term: 'TPO', definition: 'Time-Price-Opportunity - a single unit of time spent at a specific price, typically 30 minutes.', article_id: 'fundamentals-003', created_at: '' },
  { id: 'g3', term: 'Market Profile', definition: 'A charting technique that displays price against time to show where the market spent time.', article_id: 'fundamentals-001', created_at: '' },
  
  // Value Area & POC
  { id: 'g4', term: 'Value Area', definition: 'The price range where approximately 70% of trading activity occurs.', article_id: 'value-area-001', created_at: '' },
  { id: 'g5', term: 'VAH', definition: 'Value Area High - the upper boundary of the value area.', article_id: 'value-area-001', created_at: '' },
  { id: 'g6', term: 'VAL', definition: 'Value Area Low - the lower boundary of the value area.', article_id: 'value-area-001', created_at: '' },
  { id: 'g7', term: 'POC', definition: 'Point of Control - the price level with the highest trading volume or most TPOs.', article_id: 'value-area-004', created_at: '' },
  { id: 'g8', term: 'VPOC', definition: 'Volume Point of Control - the price with highest volume specifically.', article_id: 'value-area-004', created_at: '' },
  { id: 'g9', term: 'Virgin POC', definition: 'A prior session POC that has not been revisited - acts as a price magnet.', article_id: 'value-area-004', created_at: '' },
  
  // Balance & Imbalance
  { id: 'g10', term: 'Balance', definition: 'A market state with two-sided trade within a defined range.', article_id: 'balance-imbalance-001', created_at: '' },
  { id: 'g11', term: 'Imbalance', definition: 'A market state where one side dominates, creating directional movement.', article_id: 'balance-imbalance-001', created_at: '' },
  { id: 'g12', term: 'Failed Auction', definition: 'When price attempts to break out but fails to find acceptance at new levels.', article_id: 'balance-imbalance-003', created_at: '' },
  
  // Initiative & Responsive
  { id: 'g13', term: 'Initiative Activity', definition: 'Trading that moves price away from established value with conviction.', article_id: 'initiative-responsive-001', created_at: '' },
  { id: 'g14', term: 'Responsive Activity', definition: 'Trading that reacts to perceived unfair prices, often mean-reverting.', article_id: 'initiative-responsive-001', created_at: '' },
  
  // Market Structure
  { id: 'g15', term: 'Initial Balance', definition: 'The first hour of trading (A and B periods), establishing the session range.', article_id: 'market-structure-001', created_at: '' },
  { id: 'g16', term: 'Single Prints', definition: 'Price levels with only one TPO, indicating rapid movement and low acceptance.', article_id: 'fundamentals-003', created_at: '' },
  { id: 'g17', term: 'HVN', definition: 'High Volume Node - price level with significant volume, often acts as support/resistance.', article_id: 'fundamentals-004', created_at: '' },
  { id: 'g18', term: 'LVN', definition: 'Low Volume Node - price level with minimal volume, price moves quickly through these.', article_id: 'fundamentals-004', created_at: '' },
];
