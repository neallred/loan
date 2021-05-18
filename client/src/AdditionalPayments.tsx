import { useMemo, useState } from 'react';
import { Slider } from './Slider';

export enum RepeatLogic {
  Once,
  EveryOtherYear,
  Yearly,
  TwiceYearly,
  Quarterly,
  Monthly,
}

function RepeatString(x: RepeatLogic): string {
  switch (x) {
    case RepeatLogic.Once:
      return "Once"
    case RepeatLogic.EveryOtherYear:
      return "Every other year"
    case RepeatLogic.Yearly:
      return "Yearly"
    case RepeatLogic.TwiceYearly: 
      return "Twice Yearly"
    case RepeatLogic.Quarterly:
      return "Quarterly"
    case RepeatLogic.Monthly:
      return "Monthly"
    default:
      return "Unknown"
  }
}

export interface AdditionalPayment {
  id: number,
  amount: number,
  startOffset: number,
  repeat: RepeatLogic,
}

export interface AdditionalPaymentAction {
  action: 'add' | 'edit' | 'remove',
  id?: number,
  payload?: AdditionalPayment,
}

let id = 0;
function newId(): number {
  id++;
  return id
}

export function paymentsReducer(state: AdditionalPayment[], action: AdditionalPaymentAction): AdditionalPayment[] {
  console.log(action)
  switch (action.action) {
    case 'remove':
      if (!action.id) {
        return state
      }
      const removeIndex = state.findIndex(({id}) => id === action.id);
      if (removeIndex === -1) {
        return state
      }
      return [...state.slice(0, removeIndex), ...state.slice(removeIndex + 1)]
    case 'edit':
      if (!action.id) {
        return state
      }
      const editIndex = state.findIndex(({id}) => id === action.id);
      if (editIndex === -1 || !action.payload) {
        return state
      }
      return [...state.slice(0, editIndex), action.payload, ...state.slice(editIndex + 1)]
    case 'add':
      if (!action.payload) {
        return state
      }
      return state.concat(action.payload)
    default:
      return state
  }
}

function Payment(props: {payment: AdditionalPayment, delete: () => void}) {
  return <div>
    <div>
      {props.payment.amount}
    </div>
    <div>
      {calculateStartPayment(props.payment.startOffset)}
    </div>
    <div>
      {RepeatString(props.payment.repeat)}
    </div>
    <button onClick={props.delete}>x</button>
  </div>
}

interface MorePaymentsProps {
  payments: AdditionalPayment[],
  dispatch: (x: AdditionalPaymentAction) => void, 
}
export function MorePayments(props: MorePaymentsProps) {
  const [open, toggleOpen] = useState(false)
  const sortedPayments = useMemo(() => {
    const sorted = props.payments.slice();
    sorted.sort((a, b) => {
      if (a.startOffset == b.startOffset) {
        if (a.repeat == b.repeat) {
          return a.amount <= b.amount ? -1 : 1
        }
        return a.repeat < b.repeat ? -1 : 1
      }
      return a.startOffset < b.startOffset ? -1 : 1
    })
    return sorted;
  }, [props.payments])

  return <div>
    {sortedPayments.map(x => <Payment key={x.id} payment={x} delete={
      () => {props.dispatch({action: 'remove', id: x.id})}
    }/>)}
    <button onClick={(_) => {toggleOpen(wasOpen => !wasOpen)}}>
      Add additional payments
    </button>
    {open && <div>
      <PaymentForm
        onSave={props.dispatch}
        getId={newId}
      />
    </div>
    }
  </div>
}

interface AddPaymentFormProps {
  initial?: AdditionalPayment,
  onSave: (x: AdditionalPaymentAction) => void,
  getId: () => number,
}

function toMonthString(monthNumber: number): string {
  switch (monthNumber) {
    case 0:
      return "January"
    case 1:
      return "February"
    case 2:
      return "March"
    case 3:
      return "April"
    case 4:
      return "May"
    case 5:
      return "June"
    case 6:
      return "July"
    case 7:
      return "August"
    case 8:
      return "September"
    case 9:
      return "October"
    case 10:
      return "November"
    case 11:
      return "December"
    default:
      return `${monthNumber} is not a valid JavaScript month`
  }
}

function calculateStartPayment(offset: number): string {
  if (offset === 0) {
    return "Now"
  }

  if (offset === 1) {
    return "In 1 month"
  }

  const yearsFromNow = Math.floor(offset / 12)
  const monthsFromNow = offset % 12
  const startPaymentDate = new Date();
  startPaymentDate.setFullYear(startPaymentDate.getFullYear() + yearsFromNow)
  const nowMonths = startPaymentDate.getMonth();
  const newMonths = nowMonths + monthsFromNow;
  if (newMonths > 11) {
    startPaymentDate.setFullYear(startPaymentDate.getFullYear() + 1)
    startPaymentDate.setMonth(newMonths - 12)
  } else {
    startPaymentDate.setMonth(newMonths)
  }
  const whenYear = startPaymentDate.getFullYear()
  const whenMonth = toMonthString(startPaymentDate.getMonth())
  return `${whenMonth} ${whenYear}`
}

export function PaymentForm(props: AddPaymentFormProps) {
  const [amount, setAmount] = useState(props.initial ? props.initial.amount : 0);
  const [startOffset, setStartOffset] = useState(props.initial ? props.initial.startOffset : 0);
  const [repeat, setRepeat] = useState(props.initial ? props.initial.repeat : RepeatLogic.Once);
  return <div>
    <Slider
      label="Amount"
      amt={amount}
      setter={setAmount}
      step={100}
      min={100}
      max={10000}
    />
    <Slider
      label="Start Date"
      amt={startOffset}
      displayAmt={calculateStartPayment(startOffset)}
      setter={setStartOffset}
      step={1}
      min={0}
      max={360}
    />
    
    Payment type:
    <select value={repeat} onChange={(e) => {
      setRepeat(parseInt(e.target.value));
    }} >
      <option value={RepeatLogic.Once}>One Time</option>
      <option value={RepeatLogic.EveryOtherYear}>Every other year</option>
      <option value={RepeatLogic.Yearly}>Yearly</option>
      <option value={RepeatLogic.TwiceYearly}>Twice Yearly</option>
      <option value={RepeatLogic.Quarterly}>Quarterly</option>
      <option value={RepeatLogic.Monthly}>Monthly</option>
    </select>
    <button onClick={() => props.onSave({
      id: props.initial ? props.getId(): undefined,
      payload: props.initial ? undefined : {
        id: props.getId(),
        amount,
        startOffset,
        repeat,
      },
      action: props.initial ? 'edit' : 'add',
    })}>
      Add payment
    </button>
  </div>
}
