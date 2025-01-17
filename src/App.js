import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton'
import './styles.css'
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}
// very clever use of export
function App() {

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case ACTIONS.ADD_DIGIT:
        if (state.overWrite){
          return {
            ...state,
            currentOperand: payload.digit,
            overWrite: false
          }
        }
        if(payload.digit !== "." && state.currentOperand === "0"){
          return state;
        }
        if(state.currentOperand && payload.digit === '.' && state.currentOperand.includes('.')){
          return state;
        }
        return {
          ...state,
          currentOperand: `${state.currentOperand ? state.currentOperand : ''}${payload.digit}`
        }
      case ACTIONS.CLEAR:
        return{}
      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentOperand == null && state.previousOperand == null){
          return state;
        }

        if(state.currentOperand == null){
          return{
            ...state,
            operation: payload.operation
          }
        }

        if(state.previousOperand == null){
          return {
            ...state,
            operation:payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null
          }
        }
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        }
      case ACTIONS.EVALUATE:
       if(state.operation == null || state.previousOperand == null || state.currentOperand == null){
         return state
       }
       return {
         ...state,
         overWrite: true,  
         previousOperand: null,
         currentOperand: evaluate(state),
         operation: null
       }
       
       case ACTIONS.DELETE_DIGIT:
         if (state.overWrite){
           return {
             ...state,
             currentOperand: null,
             overWrite: false
           }
         }
         if (state.currentOperand == null){
           return state
         }
         if (state.currentOperand.length === 1){
           return{...state, currentOperand: null}
         }
         return {
           ...state,
           currentOperand: state.currentOperand.slice(0,-1),
         }
    }
  }
  const evaluate = ({previousOperand, currentOperand, operation})=>{
    const previous = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    // parsefloat is amazingly strong, just test it. basically makes the argument into float type.
    if ( !previous || !current){
      return ""
    }
    let computation = "";
    switch (operation){
      case '+':
        computation = previous + current;
        break
      case '-':
        computation = previous - current;
        break
      case "*":
        computation = previous * current;
        break
      case "÷":
        computation = previous / current;
        break
    }
    return computation.toString();
  }

  const [{ overWrite, currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
  // useReducer takes in two arguments, a function and an initial value.
  // the dispatch is used to update the initial data (just like in useState) 
  // the reducer function will have two parameters (one is the initial value and the other is the value passed in to dispatch)
  // THIS WORKS LIKE USESTATE BUT IS A MORE BETTER AND ELABORATE HOOK, MOSTLY USED WITH OBJECT DATA TYPES.

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">
          {currentOperand}
        </div>
      </div>
      <button className="span-two" onClick={()=>dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button
      onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}
      >DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" 
      onClick={()=>dispatch({type:ACTIONS.EVALUATE})}
      >=</button>
    </div>
  );
}

export default App;
