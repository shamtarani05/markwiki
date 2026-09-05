import { Page } from './models';
import type { PipelineStage } from 'mongoose';

// Trending = a weighted mix of raw views and search hits, not just total
// views — a page people actively search for and click is a stronger "this
// is hot right now" signal than one someone happened to link-click into.
// searchCount is incremented once per page per search query it appears in
// (see the wiki hub page's search branch), so it approximates "how often
// this page surfaces for what people are looking for."
//
// This is an all-time score, not velocity/recency-weighted — there's no
// time-series view log yet (would need a separate PageView collection with
// timestamps to do real "trending this week" decay). Documented as a
// follow-up rather than faked with an arbitrary recency cutoff.
const SEARCH_WEIGHT = 3;

export function trendingScoreStage(): PipelineStage {
  return { $addFields: { trendingScore: { $add: ['$viewCount', { $multiply: ['$searchCount', SEARCH_WEIGHT] }] } } };
}

export async function getTrendingPages(
  filter: Record<string, unknown>,
  limit: number
) {
  return Page.aggregate([
    { $match: filter },
    trendingScoreStage(),
    { $sort: { trendingScore: -1 } },
    { $limit: limit },
  ]);
}
