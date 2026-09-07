'use client';

export default function ViewFormula({ top, bottom, suffix, plain, note }) {
  if (plain) {
    return (
      <div className="formula formula-plain">
        {plain}
        {note && <div className="formula-note"><strong>{note}</strong></div>}
      </div>
    );
  }
  return (
    <div className="formula">
      <div className="formula-frac">
        <span className="formula-top">{top}</span>
        <span className="formula-bar" />
        <span className="formula-bottom">{bottom}</span>
      </div>
      {suffix && <span className="formula-suffix">{suffix}</span>}
      {note && <div className="formula-note"><strong>{note}</strong></div>}
    </div>
  );
}
