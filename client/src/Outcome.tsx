import { useEffect } from 'react';

import * as d3 from "d3";
interface Inputs {
  yearlyTax: number 
  yearlyInsurance: number 
  principle: number 
  annualInterestRate: number 
  monthlyPayment: number 
  yearsLeft: number 
}

interface PaymentMonth {
  paid: number,
  interestPaid: number,
  principlePaid: number,
  remaining: number,
  paymentMonth: number,
}

interface PaymentHistory {
  left: number,
  totals: {
    all: number,
    principle: number,
    interest: number,
    insurance: number,
    tax: number
  },
  monthCount: number,
  months: PaymentMonth[],
} 

function scanPayments(inputs: Inputs): PaymentHistory {
  let remaining = inputs.principle;
  let months = [];
  let totals = {
    all: 0,
    principle: 0,
    interest: 0,
    insurance: 0,
    tax: 0,
  };
  let paymentMonth = 1;
  for (let i = inputs.yearsLeft * 12; i > 0; i--) {
    if (remaining <= 0) {
      break
    }
    const interestAccrued = (inputs.annualInterestRate / 100 / 12) * remaining
    const taxPaid = inputs.yearlyTax / 12;
    const insurancePaid = inputs.yearlyInsurance / 12;
    const increases = insurancePaid + taxPaid + interestAccrued;
    const payment = inputs.monthlyPayment > (increases + remaining) ? increases + remaining : inputs.monthlyPayment;
    const newRemaining = remaining + increases - payment;
    const principlePaid = remaining - newRemaining;
    remaining = newRemaining;
    totals.all += payment;
    totals.interest += interestAccrued;
    totals.principle += principlePaid;
    totals.tax += taxPaid;
    totals.insurance += insurancePaid;
    months.push({
      paid: payment,
      interestPaid: interestAccrued,
      principlePaid,
      remaining,
      paymentMonth,
    })
    paymentMonth += 1;
  }

  return {
    left: remaining,
    totals,
    monthCount: months.length,
    months: months,
  }
}

function numTo$(x: number): string {
  return '$' + (Math.round((x * 100)) / 100).toLocaleString()
}

function monthsToTime(months: number): string {
  const monthsLeft = months % 12;
  const years = Math.floor(months / 12);
  let str = '';
  if (years > 0) {
    str += years === 1 ? '1 year' : `${years} years`
    if (monthsLeft > 0) {
      str += ' and '
    }
  }
  if (monthsLeft === 1) {
    str += '1 month'
  } else if (monthsLeft > 1) {
    str += `${monthsLeft} months`
  }
  return str;
}

export function Outcome(inputs: Inputs) {
  const paymentHistory = scanPayments(inputs);
  const time = monthsToTime(paymentHistory.monthCount);
  useEffect(() => drawGraph(paymentHistory, inputs), [paymentHistory, inputs])
  useEffect(() => drawPie(paymentHistory, inputs), [paymentHistory, inputs])
  return <div
    style={{
      paddingBottom: '30px',
    }}
  >
    <div id="graph-mount"/>
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      }}>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      }}>
      <div>Legend:</div>
      <div style={{ color: 'black' }}>Payment</div>
      <div style={{ color: 'green'}}>Principle</div>
      <div style={{ color: 'red' }}>Interest</div>
    </div>
      <div id="pie-mount"/>
    </div>
    <div>After {time}, </div>
    you paid {numTo$(paymentHistory.totals.principle)} in principle, {numTo$(paymentHistory.totals.interest)} in interest, {numTo$(paymentHistory.totals.tax)} taxes & {numTo$(paymentHistory.totals.insurance)} insurance
    {paymentHistory.left > 0 ? <div>You still have {numTo$(paymentHistory.left)} to pay</div> : <div style={{opacity: 0}}>a</div>}
  </div>
}

const BODY_MARGIN = 20;
const drawGraph = (paymentHistory: PaymentHistory, inputs: Inputs) => {
  const margin = { top: 10, right: 10, bottom: 20, left: 40 };
  const width = Math.min(800, document.body.offsetWidth - margin.left - margin.right - BODY_MARGIN);
  const height = Math.min(window.innerHeight, width / 2) - margin.top - margin.bottom;
  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);
  const toMonth = (d: PaymentMonth)=> x(d.paymentMonth / 12)

  const principleLine = d3.line<PaymentMonth>()
    .x(toMonth)
    .y(d => y(d.principlePaid));

  const payLine = d3.line<PaymentMonth>()
    .x(toMonth)
    .y(d => y(d.paid));

  const interestLine = d3.line<PaymentMonth>()
    .x(toMonth)
    .y(d => y(d.interestPaid));

  d3.select("#graph-mount svg").remove();

  const svg = d3.select("#graph-mount").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  x.domain([0, inputs.yearsLeft]);
  y.domain([0, paymentHistory.months.reduce((acc, curr) => Math.max(acc, ...[curr.principlePaid, curr.interestPaid, curr.paid]), 0)]);

  svg.append("path")
    .datum(paymentHistory.months)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 1.5)
    .attr("d", principleLine);

  svg.append("path")
    .datum(paymentHistory.months)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("d", payLine);

  svg.append("path")
    .datum(paymentHistory.months)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", interestLine);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));
}

const drawPie = (paymentHistory: PaymentHistory, _inputs: Inputs) => {
  d3.select("#pie-mount svg").remove();
  const diameter = document.body.offsetWidth / 4;
  const svg = d3.select("#pie-mount").append("svg")
    .attr("width", diameter)
    .attr("height", diameter);
  const radius = diameter / 2;
  const g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  const color = d3.scaleOrdinal(['green','red'])
  const data = [paymentHistory.totals.principle, paymentHistory.totals.interest];
  const pie = d3.pie()

  const arc: any = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  //Generate groups
  const arcs = g.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs.append("path")
    .attr("fill", (_, i:any) => color(i))
    .attr("d", arc);
}
