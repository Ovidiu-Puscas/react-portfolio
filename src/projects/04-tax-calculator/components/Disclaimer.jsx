import React from 'react';

const Disclaimer = () => {
  return (
    <div className="note">
      <p className="font-bold mb-2">Disclaimer on Tax Calculations and Exchange Rates:</p>
      <ul className="list-disc list-inside mt-2">
        <li>The tax calculations in this tool are simplified estimates based on common scenarios for a <strong>Micro SRL (micro-enterprise)</strong> in Romania. Actual tax obligations can be more complex and depend on various factors, including specific CAEN codes, employee count, and annual turnover thresholds.</li>
        <li><strong>Current Year (2025) Tax Assumptions (Micro SRL):</strong>
          <ul className="list-circle list-inside ml-4">
            <li><strong>Micro SRL Tax:</strong> Applied to gross monthly income (turnover) at the rate you specify (typically 1% or 3%).</li>
            <li><strong>Minimum Gross Wage (2025):</strong> RON 4,050/month.</li>
            <li><strong>Dividend Tax (2025):</strong> 10% applied to the company's net profit (after micro SRL tax), when distributed to the individual owner.</li>
            <li><strong>CASS (Health Insurance Contribution for Individual on Dividends):</strong> 10% of a capped annual base (6, 12, or 24 times the 2025 minimum gross wage). No CASS if annualized dividend income is below 6 minimum wages. CAS (Pension Contribution) is generally <strong>not</strong> applicable to dividend income.</li>
          </ul>
        </li>
        <li><strong>Next Year (2026) Tax Assumptions (Micro SRL & Dividend Income):</strong>
          <ul className="list-circle list-inside ml-4">
            <li><strong>Micro SRL Tax:</strong> Applied to gross monthly income (turnover) at the rate you specify (typically 1% or 3%).</li>
            <li><strong>Minimum Gross Wage (2026):</strong> For calculation purposes, the <strong>2025 minimum gross wage of RON 4,050/month</strong> is used as a placeholder, as the official 2026 value is not yet available.</li>
            <li><strong>Dividend Tax (2026):</strong> Configurable (defaulting to 16% as per your request, reflecting proposed changes, but can be changed). Applied to the company's net profit (after micro SRL tax), when distributed to the individual owner.</li>
            <li><strong>CASS (Health Insurance Contribution for Individual on Dividends):</strong> 10% of a capped annual base (6, 12, or 24 times the 2026 placeholder minimum gross wage). No CASS if annualized dividend income is below 6 minimum wages.</li>
          </ul>
        </li>
        <li><strong>Hours:</strong> Calculations assume 160 working hours per month.</li>
        <li><strong>Exchange Rates:</strong> The USD to RON and RON to EUR exchange rates are manually entered by you and are <strong>not real-time</strong>. For accurate conversions, please ensure you update these values as needed.</li>
      </ul>
      <p className="mt-2">For accurate and personalized financial planning, please consult with a qualified tax professional in Romania.</p>
    </div>
  );
};

export default Disclaimer;
