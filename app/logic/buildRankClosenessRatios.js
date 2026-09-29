import buildMatchedPairs from './buildMatchedPairs';

// Per matched pair: the smaller matched rank over the larger, so BAW #90 vs TC #100 and the reverse both give 0.9.
export default function buildRankClosenessRatios(result) {
  return buildMatchedPairs(result).map((pair) => {
    const bawRank = pair.baw.matchedScoreRank;
    const tcRank = pair.tc.matchedScoreRank;
    return Math.min(bawRank, tcRank) / Math.max(bawRank, tcRank);
  });
}
