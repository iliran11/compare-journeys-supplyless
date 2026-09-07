'use client';

import computeAggregateHealthMetrics from '../logic/computeAggregateHealthMetrics';
import gaugeColorForPercent from '../logic/gaugeColorForPercent';
import gaugeColorForCloseness from '../logic/gaugeColorForCloseness';
import ViewFormula from './ViewFormula';
import ViewGauge from './ViewGauge';
import ViewInfoPopover from './ViewInfoPopover';

function TileLabel({ label, formula }) {
  return (
    <div className="dash-tile-label">
      {label}
      {formula && <ViewInfoPopover formula={formula} />}
    </div>
  );
}

function Tile({ label, formula, value, sub }) {
  return (
    <div className="dash-tile">
      <TileLabel label={label} formula={formula} />
      <div className="dash-tile-value">{value}</div>
      {sub && <div className="dash-tile-sub">{sub}</div>}
    </div>
  );
}

function GaugeTile({ label, formula, percent, sub, invert, color }) {
  return (
    <div className="dash-tile dash-tile-gauge">
      <TileLabel label={label} formula={formula} />
      <ViewGauge percent={percent} color={color || gaugeColorForPercent(percent, { invert })} />
      {sub && <div className="dash-tile-sub">{sub}</div>}
    </div>
  );
}

function CompareGaugeTile({ label, formula, percent, color, bawValue, tcValue }) {
  return (
    <div className="dash-tile dash-tile-gauge dash-tile-wide">
      <TileLabel label={label} formula={formula} />
      <ViewGauge percent={percent} color={color} />
      <div className="dash-tile-compare">
        <div className="dash-tile-compare-side">
          <div className="dash-tile-compare-tag baw">BAW</div>
          <div className="dash-tile-value">{bawValue}</div>
        </div>
        <div className="dash-tile-compare-divider" />
        <div className="dash-tile-compare-side">
          <div className="dash-tile-compare-tag tc">TC</div>
          <div className="dash-tile-value">{tcValue}</div>
        </div>
      </div>
    </div>
  );
}

function formatPrice(value) {
  return value == null ? '—' : '$' + Math.round(value);
}

export default function ViewHealthDashboard({ routes }) {
  const m = computeAggregateHealthMetrics(routes);

  return (
    <div className="dash">
      <GaugeTile
        label="Journey match"
        formula={<ViewFormula top="matched" bottom="bawTotal" suffix="× 100" />}
        percent={m.matchPercent}
        sub={m.bawTotal ? m.matchedCount + '/' + m.bawTotal : null}
      />
      <GaugeTile
        label="Duplicates"
        formula={<ViewFormula top="duplicates" bottom="bawTotal" suffix="× 100" />}
        percent={m.duplicatePercent}
        sub={m.bawTotal ? m.duplicateCount + '/' + m.bawTotal : null}
        invert
      />
      <CompareGaugeTile
        label="Avg pictures"
        formula={<ViewFormula top="tcAvgPictures" bottom="bawAvgPictures" suffix="× 100" />}
        percent={m.pictureClosenessPercent}
        color={gaugeColorForCloseness(m.pictureClosenessPercent)}
        bawValue={m.bawAvgPictures == null ? '—' : m.bawAvgPictures.toFixed(1)}
        tcValue={m.tcAvgPictures == null ? '—' : m.tcAvgPictures.toFixed(1)}
      />
      <CompareGaugeTile
        label="Avg price"
        formula={<ViewFormula top="bawAvgPrice" bottom="tcAvgPrice" suffix="× 100" />}
        percent={m.priceClosenessPercent}
        color={gaugeColorForCloseness(m.priceClosenessPercent, { greenThreshold: 15 })}
        bawValue={formatPrice(m.bawAvgPrice)}
        tcValue={formatPrice(m.tcAvgPrice)}
      />
      <GaugeTile
        label="Class match"
        formula={<ViewFormula top="classMatch" bottom="classTotal" suffix="× 100" />}
        percent={m.classMatchPercent}
        sub={m.classTotal ? m.classMatchCount + '/' + m.classTotal : null}
      />
      <Tile
        label="Avg rank diff"
        formula={<ViewFormula plain="For each matched BAW journey, its rank within BAW's matched set vs. its pair's rank within TC's matched set — averaged across all matched journeys. Lower is better." />}
        value={m.avgRankDiff == null ? '—' : m.avgRankDiff.toFixed(1)}
        sub={m.rankDiffComparedCount ? m.rankDiffComparedCount + ' journeys' : null}
      />
    </div>
  );
}
