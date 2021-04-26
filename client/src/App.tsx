import { useState } from 'react';
import { Outcome } from './Outcome';

interface SliderProps {
  label: string,
  amt: number,
  min?: number,
  max: number,
  step: number,
  displayAmt?: string,
  setter: (x: number) => void,
}

function Slider({
  label,
  amt,
  displayAmt,
  setter,
  step,
  min,
  max,
  ...inputProps
}: SliderProps) {
  return (
    <div
      style={{
        paddingBottom: "30px"
      }}
    >
      <div>
        <label htmlFor={label}>{label}: {displayAmt || amt}</label>
      </div>
      <input
        {...inputProps}
        id={label}
        min={min || 0}
        max={max}
        step={step}
        type="range"
        className="slider"
        value={amt}
        style={{
          width: "100%",
          maxWidth: 'calc(100vw - 30px)',
        }}
        onChange={e => setter(parseInt(e.target.value))}
      />
    </div>
  )
}

const PERCENTAGE_GRANULARITY = 40;

const SLIDER_SIZE = '40px';
const sliderStyles = `
/* The slider itself */
.slider {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: ${SLIDER_SIZE}; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: ${SLIDER_SIZE}; /* Set a specific slider handle width */
  height: ${SLIDER_SIZE}; /* Slider handle height */
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  width: ${SLIDER_SIZE}; /* Set a specific slider handle width */
  height: ${SLIDER_SIZE}; /* Slider handle height */
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}
`;

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
          label="Initial remaining"
          amt={principle}
          displayAmt={`$${principle}`}
          setter={setPrinciple}
          min={50000}
          max={700000}
          step={1000}
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
          label="Monthly payment"
          amt={monthlyPayment}
          displayAmt={`$${monthlyPayment}`}
          setter={setMonthlyPayment}
          max={5000}
          step={20}
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
