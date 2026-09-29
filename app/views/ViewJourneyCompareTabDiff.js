'use client';

import { scoreText, classText, picturesText, stationsText, vehicleTypeText, priceText } from '../logic/diffTexts';

export default function ViewJourneyCompareTabDiff({ pairs }) {
  if (pairs.length === 0) {
    return <div className="explain diff"><span className="empty">No matched BAW × TC pairs in this group.</span></div>;
  }

  return pairs.map((pair, i) => {
    const bawRows = [pair.baw];
    const tcRows = [pair.tc];
    return (
      <div key={i} className="explain diff">
        <span className="lbl">pair {i + 1}/{pairs.length}</span>
        <table className="diff-table">
          <thead>
            <tr><th></th><th className="baw">BAW</th><th className="tc">TC</th></tr>
          </thead>
          <tbody>
            <tr><td>Transport</td><td>{pair.baw.tripId}</td><td>{pair.tc.tripId}</td></tr>
            <tr><td>Price</td><td>{priceText(bawRows)}</td><td>{priceText(tcRows)}</td></tr>
            <tr><td>Ranking</td><td>{scoreText(bawRows)}</td><td>{scoreText(tcRows)}</td></tr>
            <tr><td>Stations</td><td>{stationsText(bawRows)}</td><td>{stationsText(tcRows)}</td></tr>
            <tr><td>Class</td><td>{classText(bawRows)}</td><td>{classText(tcRows)}</td></tr>
            <tr><td>Vehicle type</td><td>{vehicleTypeText(bawRows)}</td><td>{vehicleTypeText(tcRows)}</td></tr>
            <tr><td>Pictures</td><td>{picturesText(bawRows)}</td><td>{picturesText(tcRows)}</td></tr>
          </tbody>
        </table>
      </div>
    );
  });
}
