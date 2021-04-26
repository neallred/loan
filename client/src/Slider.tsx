interface SliderProps {
  label: string,
  amt: number,
  min?: number,
  max: number,
  step: number,
  displayAmt?: string,
  setter: (x: number) => void,
}

export function Slider({
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


const SLIDER_SIZE = '40px';
export const sliderStyles = `
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
