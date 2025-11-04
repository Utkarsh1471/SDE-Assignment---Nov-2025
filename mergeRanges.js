/**
 * Merges discontinuous time ranges within a given threshold.
 * 
 * @param {Array<[number, number]>} ranges - Array of [start, end) ranges (unsorted, may overlap)
 * @param {number} threshold - Max gap (in ms) allowed between ranges to still be merged
 * @returns {Array<[number, number]>} - Sorted, non-overlapping merged ranges
 */
const mergeTimeRanges = (ranges, threshold) => {
  if (!Array.isArray(ranges)) {
    throw new Error('ranges should be an array of [start, end] pairs.');
  }
  
  // Filter out invalid ranges
  const validRanges = ranges.filter(range => 
    Array.isArray(range) &&
    range.length === 2 &&
    typeof range[0] === 'number' &&
    typeof range[1] === 'number' &&
    range[0] < range[1]
  );

  // Sort ranges based on start time
  validRanges.sort((a, b) => a[0] - b[0]);

  const mergedRanges = [];

  for (const current of validRanges) {
    if (mergedRanges.length === 0) {
      // Initialize with the first range
      mergedRanges.push([...current]);
    } else {
      const last = mergedRanges[mergedRanges.length - 1];

      // Check if current range overlaps or is within threshold of last range
      if (current[0] <= last[1] + threshold) {
        // Merge the current range into last
        last[1] = Math.max(last[1], current[1]);
      } else {
        // No overlap or within threshold, add as new range
        mergedRanges.push([...current]);
      }
    }
  }

  return mergedRanges;
};

module.exports = {
  mergeTimeRanges
};
