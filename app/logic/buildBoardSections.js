import isMultistationRow from './isMultistationRow';

// Route-page sections: single-station and multistation journeys, each with its matched and unmatched rows.
// A match group never splits across sections: identical stop sets are either both multistation or both not.
export default function buildBoardSections(rows) {
  function pick(multistation) {
    const section = {
      matchedBaw: rows.matchedBaw.filter((row) => isMultistationRow(row) === multistation),
      matchedTc: rows.matchedTc.filter((row) => isMultistationRow(row) === multistation),
      bawOnly: rows.bawOnly.filter((row) => isMultistationRow(row) === multistation),
      tcOnly: rows.tcOnly.filter((row) => isMultistationRow(row) === multistation)
    };
    section.isEmpty = section.matchedBaw.length + section.matchedTc.length + section.bawOnly.length + section.tcOnly.length === 0;
    return section;
  }

  return { singleStation: pick(false), multistation: pick(true) };
}
