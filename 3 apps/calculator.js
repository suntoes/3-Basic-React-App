function AppCalculator() {
    const [input, setInput] = React.useState('');
    const [output, setOutput] = React.useState(0);
    const [decimalTrigger, setDecimalTrigger] = React.useState(true);
    const [zeroTrigger, setZeroTrigger] = React.useState(true);
    const [bump, setBump] = React.useState(
      new Audio("https://raw.githubusercontent.com/darklight721/keyboard-sounds/master/audio/key_press.mp3")
    );
    
    React.useEffect(() => {
      document.addEventListener('keydown', keyDownPress);

      return () => {
          document.removeEventListener("keydown", keyDownPress)
      };
  })
  
    const playBump =() => {
      bump.currentTime = 0;
      bump.play()
    };
  
    const customKeys = { 
      48: '0',
      49: '1',
      51: '2',
      52: '3',
      53: '4',
      50: '5',
      54: '6',
      55: '7',
      56: '8',
      57: '9',
      190: '.',
      191: '/',
      88: '*',
      187: '+',
      189: '-'
    };
  
    const keyDownPress = (e) => {
      if (e.keyCode in customKeys) {
        pass(customKeys[e.keyCode])
      } else if (e.keyCode === 8) {
            backSpace();
      } else if (e.keyCode === 13) {
            compute();
      } else if (e.keyCode === 27) {
            allClear();
      }
    }
  
    const pass = (symbol) => {
      playBump();

      if((symbol === '.' && !decimalTrigger) || (symbol === '0' && !zeroTrigger)) {
        return;
      };

      if(/[+-/*]/.test(symbol)) {
        setDecimalTrigger(true)
        setZeroTrigger(true);
      };

      if(/[0-9]/.test(symbol) && output !== 0) {
        allClear();
      } else if (/[+-/*]/.test(symbol) && output !== 0) {
            setInput(output.toString() + symbol);
            setOutput(0);
            return;
      } else if (/[/*]/.test(symbol) && /[/*+-]/.test(input[input.length-1]) ) {
            backSpace();
      } else if (/[*/]/.test(symbol) && input === ''){
            return
      };

      setInput((prev) => prev + symbol)

      if (symbol === '.') {
        setDecimalTrigger(false)
      } else if (symbol === '0' && decimalTrigger) {
            setZeroTrigger(false)
      };
    };
  
    const compute = () => {
      playBump();
      setOutput(eval(input))
    };
  
    const inputBlank = (e) => {
    };
  
    const allClear = () => {
      playBump();
      setInput('');
      setOutput(0);
      setDecimalTrigger(true);
      setZeroTrigger(true);
    };
  
    const backSpace = () => {
      playBump();
      setInput((prev) => prev.split("").splice(0, prev.length-1).join(""))
    };
  
    return(
      <div className="wrapper">
        <link rel="stylesheet" href="./3 apps/styleCalculator.css"></link>
        <div className="display">
          <input placeholder="0" value={input} onChange={inputBlank}></input>
          <br></br>
          <div id="display">{output}</div>
        </div>
        <div onClick={allClear} className="button" id="clear" >AC</div>
        <div onClick={backSpace} className="button" id="back" >C</div>
        <div onClick={ () => pass("/") } className="button" id="divide" >/</div>
        <div onClick={ () => pass("*") } className="button" id="multiply" >*</div>
        <div onClick={ () => pass("7") } className="button" id="seven" >7</div>
        <div onClick={ () => pass("8") } className="button" id="eight" >8</div>
        <div onClick={ () => pass("9") } className="button" id="nine" >9</div>
        <div onClick={ () => pass("+") } className="button" id="add" >+</div>
        <div onClick={ () => pass("4") } className="button" id="four" >4</div>
        <div onClick={ () => pass("5") } className="button" id="five" >5</div>
        <div onClick={ () => pass("6") } className="button" id="six" >6</div>
        <div onClick={ () => pass("-") } className="button" id="subtract" >-</div>
        <div onClick={ () => pass("1") } className="button" id="one" >1</div>
        <div onClick={ () => pass("2") } className="button" id="two" >2</div>
        <div onClick={ () => pass("3") } className="button" id="three" >3</div>
        <div onClick={compute} className="button equals" id="equals" >=</div>
        <div onClick={ () => pass("0") } className="button zero" id="zero" >0</div>
        <div onClick={ () => pass(".") } className="button decimal" id="decimal" >.</div>
      </div>
  
    );
};