import { useReducer } from "react";
import styles from "./app.module.scss";

/* TYPES */

type Operator = "+" | "-" | "*" | "/";

interface CalculatorState {
  currentValue: string;
  previousValue: number | null;
  operator: Operator | null;
  expression: string; // Added to track the full expression
}

type CalculatorAction =
  | { type: "ADD_NUMBER"; payload: string }
  | { type: "SET_OPERATOR"; payload: Operator }
  | { type: "CALCULATE" }
  | { type: "CLEAR" };

/* STATE */

const initialState: CalculatorState = {
  currentValue: "",
  previousValue: null,
  operator: null,
  expression: "", // Initialize expression
};

/* REDUCER  */

function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case "ADD_NUMBER":
      const newValue = state.currentValue + action.payload;
      return {
        ...state,
        currentValue: newValue,
        // Update expression to show the calculation so far
        expression: state.previousValue !== null && state.operator !== null 
          ? `${state.previousValue} ${state.operator} ${newValue}`
          : newValue,
      };

    case "SET_OPERATOR":
      if (state.currentValue === "") {
        // Don't set operator if no current value
        return state;
      }
      
      return {
        previousValue: Number(state.currentValue),
        currentValue: "",
        operator: action.payload,
        // Show "5 + " in the expression
        expression: `${Number(state.currentValue)} ${action.payload}`,
      };

    case "CALCULATE": {
      if (state.previousValue === null || state.operator === null || state.currentValue === "") {
        return state;
      }

      const current = Number(state.currentValue);
      let result: number | string;

      switch (state.operator) {
        case "+":
          result = state.previousValue + current;
          break;
        case "-":
          result = state.previousValue - current;
          break;
        case "*":
          result = state.previousValue * current;
          break;
        case "/":
          result = current === 0 ? "Error" : state.previousValue / current;
          break;
        default:
          return state;
      }

      const fullExpression = `${state.previousValue} ${state.operator} ${current} =`;
      
      return {
        currentValue: String(result),
        previousValue: null,
        operator: null,
        expression: fullExpression,
      };
    }

    case "CLEAR":
      return initialState;

    default:
      return state;
  }
}

/*COMPONENT*/

export default function App() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  // Determine what to display
  const displayValue = state.expression || state.currentValue || "0";

  return (
    <div className={styles.calculator}>
      <h1>Lommeregner</h1>

      <div className={styles.display}>
        {displayValue}
      </div>

      <div className={styles.buttons}>
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() =>
              dispatch({ type: "ADD_NUMBER", payload: num.toString() })
            }
          >
            {num}
          </button>
        ))}
        <button onClick={() => dispatch({ type: "SET_OPERATOR", payload: "+" })}>+</button>

        {[4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() =>
              dispatch({ type: "ADD_NUMBER", payload: num.toString() })
            }
          >
            {num}
          </button>
        ))}
        <button onClick={() => dispatch({ type: "SET_OPERATOR", payload: "-" })}>-</button>

        {[7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() =>
              dispatch({ type: "ADD_NUMBER", payload: num.toString() })
            }
          >
            {num}
          </button>
        ))}
        <button onClick={() => dispatch({ type: "SET_OPERATOR", payload: "*" })}>*</button>
        <button onClick={() => dispatch({ type: "ADD_NUMBER", payload: "0" })}>0</button>
        <button onClick={() => dispatch({ type: "CALCULATE" })}>=</button>
        <button onClick={() => dispatch({ type: "CLEAR" })}>C</button>
        <button onClick={() => dispatch({ type: "SET_OPERATOR", payload: "/" })}>/</button>
      </div>
    </div>
  );
}