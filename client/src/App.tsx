import { useState } from 'react';
import { Outcome } from './Outcome';
import { Slider, sliderStyles } from './Slider';

const PERCENTAGE_GRANULARITY = 40;


function App() {
  const [yearlyTax, setYearlyTax] = useState(2500);
  const [yearlyInsurance, setYearlyInsurance] = useState(3000);
  const [principle, setPrinciple] = useState(250000);
  const [inputInterestRate, setAnnualInterestRate] = useState(6 * PERCENTAGE_GRANULARITY);
  const [monthlyPayment, setMonthlyPayment] = useState(2000);
  const [yearsLeft, setYearsLeft] = useState(30);
  const annualInterestRate = inputInterestRate / PERCENTAGE_GRANULARITY;

  return (
    <div>
      <style>
        {sliderStyles}
      </style>
      <div>
        <Outcome
          yearlyTax={yearlyTax}
          yearlyInsurance={yearlyInsurance}
          principle={principle}
          annualInterestRate={annualInterestRate}
          monthlyPayment={monthlyPayment}
          yearsLeft={yearsLeft}
        />
      </div>
      <div>
        <Slider
          label="Monthly payment"
          amt={monthlyPayment}
          displayAmt={`$${monthlyPayment}`}
          setter={setMonthlyPayment}
          max={5000}
          step={20}
        />
        <Slider
          label="Initial remaining"
          amt={principle}
          displayAmt={`$${principle}`}
          setter={setPrinciple}
          min={50000}
          max={700000}
          step={1000}
        />
        <Slider
          label="Yearly insurance"
          amt={yearlyInsurance}
          displayAmt={`$${yearlyInsurance}`}
          setter={setYearlyInsurance}
          max={20000}
          step={50}
        />
        <Slider
          label="Yearly tax"
          amt={yearlyTax}
          displayAmt={`$${yearlyTax}`}
          setter={setYearlyTax}
          max={20000}
          step={50}
        />
        <Slider
          label="Annual interest rate"
          amt={inputInterestRate}
          displayAmt={annualInterestRate.toString() + '%'}
          setter={setAnnualInterestRate}
          min={1 * PERCENTAGE_GRANULARITY}
          max={10 * PERCENTAGE_GRANULARITY}
          step={1}
        />
        <Slider
          label="Years left"
          amt={yearsLeft}
          setter={setYearsLeft}
          max={30}
          step={1}
        />
      </div>
    </div>
  );
}

export default App;
