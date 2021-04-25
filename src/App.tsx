import React, { useState } from 'react';

interface SliderProps {
  label: string,
  amt: number,
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
  max,
  ...inputProps
}: SliderProps) {
  return (
    <div
      style={{
        paddingBottom: "30px"
      }}
    >
      <input
        {...inputProps}
        id={label}
        min={0}
        max={max}
        step={step}
        type="range"
        value={amt}
        style={{
          width: "100%",
          maxWidth: '100vw',
        }}
        onChange={e => setter(parseInt(e.target.value))}
      />
      <div>
      <label htmlFor={label}>{label} {displayAmt || amt}</label>
      </div>
    </div>
  )
}

const PERCENTAGE_GRANULARITY = 40;

interface OutcomeProps {
  yearlyTax: number 
  yearlyInsurance: number 
  principle: number 
  annualInterestRate: number 
  monthlyPayment: number 
  monthsLeft: number 
}

interface month {
  paid: number,
  interestPaid: number,
  principalPaid: number,
  remaining: number,
}

interface PaymentHistory {
  left: number,
  youPaid: number,
  youPaidInterest: number,
  monthCount: number,
  months: month[],
} 

function scanPayments(facts: OutcomeProps): PaymentHistory {
  let remaining = facts.principle;
  let months = [];
  let youPaid = 0;
  let youPaidInterest = 0;
  for (let i = facts.monthsLeft; i > 0; i--) {
    if (remaining <= 0) {
      break
    }
    const interestAccrued = (facts.annualInterestRate / 100 / 12) * remaining
    const increases = (
       (facts.yearlyInsurance / 12) +
         (facts.yearlyTax / 12) +
         interestAccrued 
    );
    const payment = facts.monthlyPayment > (increases + remaining) ? increases + remaining : facts.monthlyPayment;
    const newRemaining = remaining + increases - payment;
    const principalPaid = remaining - newRemaining;
    remaining = newRemaining;
    youPaid += payment;
    youPaidInterest += interestAccrued;
    months.push({
      paid: payment,
      interestPaid: interestAccrued,
      principalPaid,
      remaining,
    })
  }

  return {
    left: remaining,
    youPaid,
    youPaidInterest,
    monthCount: months.length,
    months: months,
  }
}

function Outcome({
  yearlyTax,
  yearlyInsurance,
  principle,
  annualInterestRate,
  monthlyPayment,
  monthsLeft,
}: OutcomeProps) {
  const paymentHistory = scanPayments({
    yearlyTax,
    yearlyInsurance,
    principle,
    annualInterestRate,
    monthlyPayment,
    monthsLeft,
  })
  if (paymentHistory.monthCount == 0 || principle <= 0) {
    return <div
      style={{
        paddingBottom: '30px',
      }}
    />
  }
  return <div
    style={{
      paddingBottom: '30px',
    }}
  >
    After {paymentHistory.monthCount} months, you paid {paymentHistory.youPaid} ({paymentHistory.youPaidInterest} in interest).
    {paymentHistory.left > 0 && <div>You still have ${paymentHistory.left} to pay</div>}
  </div>
}

function App() {
  const [yearlyTax, setYearlyTax] = useState(0);
  const [yearlyInsurance, setYearlyInsurance] = useState(0);
  const [principle, setPrinciple] = useState(0);
  const [annualInterestRate, setAnnualInterestRate] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [monthsLeft, setMonthsLeft] = useState(360);
  const actualInterestRate = annualInterestRate / PERCENTAGE_GRANULARITY;

  return (
    <div>
      <div>
        <Outcome
          yearlyTax={yearlyTax}
          yearlyInsurance={yearlyInsurance}
          principle={principle}
          annualInterestRate={actualInterestRate}
          monthlyPayment={monthlyPayment}
          monthsLeft={monthsLeft}
        />
      </div>
      <div>
        <Slider
          label="Yearly insurance"
          amt={yearlyInsurance}
          setter={setYearlyInsurance}
          max={20000}
          step={50}
        />
        <Slider
          label="Yearly tax"
          amt={yearlyTax}
          setter={setYearlyTax}
          max={20000}
          step={50}
        />
        <Slider
          label="Remaining principle"
          amt={principle}
          setter={setPrinciple}
          max={1000000}
          step={1000}
        />
        <Slider
          label="Annual interest rate (%)"
          amt={annualInterestRate}
          displayAmt={actualInterestRate.toString()}
          setter={setAnnualInterestRate}
          max={20 * PERCENTAGE_GRANULARITY}
          step={1}
        />
        <Slider
          label="Monthly payment"
          amt={monthlyPayment}
          setter={setMonthlyPayment}
          max={5000}
          step={20}
        />
        <Slider
          label="Months left"
          amt={monthsLeft}
          setter={setMonthsLeft}
          max={360}
          step={1}
        />
      </div>
    </div>
  );
}

export default App;
