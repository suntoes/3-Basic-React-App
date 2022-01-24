function App() {
  const [dTest, setdTest] = React.useState(true);
  const [cTest, setcTest] = React.useState(false);
  const [pcTest, setpcTest] = React.useState(false);

  const drum = () => {
    setcTest(false);
    setpcTest(false);
    setdTest(true);
  };

  const clo = () => {
    setdTest(false);
    setcTest(false);
    setpcTest(true);
  };

  const calcu = () => {
    setpcTest(false);
    setdTest(false);
    setcTest(true);
  };

  return(
    <div className="main-wrap">
      <header className="main-header">
      <div className="x-button" onClick={drum} style={{filter: dTest ? 'brightness(150%)' : ''}}>Drum Machine</div>
      <div className="x-button" onClick={clo} style={{filter: pcTest ? 'brightness(150%)' : ''}}>25+5 Clock</div>
      <div className="x-button" onClick={calcu} style={{filter: cTest ? 'brightness(150%)' : ''}}>Calculator</div>
      </header>
      <div className="showcase">
        { dTest ? <AppDrum /> : cTest ? <AppCalculator /> : pcTest ? <AppClock /> : 'loading...'}
        <p style={{color: 'white', textAlign: 'center'}}>{ (dTest || cTest || pcTest) && 'by: swanktos'}</p>
      </div>
    </div>
  )
};

function AppClock() {
  const [displayTime, setDisplayTime] = React.useState(25*60);
  const [breakTime, setBreakTime] = React.useState(5*60);
  const [sessionTime, setSessionTime] = React.useState(25*60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [onMute, setOnMute] = React.useState(false);
  const [breakAudio, setBreakAudio] = React.useState(
      new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav")
  );

  function formatTime(time) {
    let min = Math.floor(time / 60)
    let sec = time % 60
    return (
      (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)
    )
  };

  const [bump, setBump] = React.useState(
      new Audio("https://raw.githubusercontent.com/darklight721/keyboard-sounds/master/audio/key_press.mp3")
  );

  const playBeep =() => {
      breakAudio.currentTime = 0;
      breakAudio.play()
  };

  const playBump =() => {
      if (onMute) {
          bump.volume = 0;
      } else {
          bump.volume = 1;
      }
      bump.currentTime = 0;
      bump.play()
  };

  const mutePrompt = () => {
      playBump()
      setOnMute(!onMute)    
  };

  const changeTime = (amount, type) => {
      playBump();
      switch(type) {
          case "break":
              if (( breakTime <= 60 && amount < 0) || (breakTime >= 3600 && amount > 0)) {
                  return
              }
              setBreakTime((prev) => prev + amount)
              break;
          case "session":
              if (( sessionTime <= 60 && amount < 0) || (sessionTime >= 3600 && amount > 0)) {
                  return
              }
              setSessionTime((prev) => prev + amount);
              !timerOn && setDisplayTime(sessionTime + amount);
               break;
      }
  };

  const controlTime = () => {
      playBump();
      let sec = 1000;
      let date = new Date().getTime();
      let nextDate = new Date().getTime() + sec;
      let onBreakVar = onBreak
      if(!timerOn) {
          let interval = setInterval(() => {
              date =  new Date().getTime();
              if (date > nextDate) {
                  setDisplayTime(prev => {
                      if (prev <= 0 && !onBreakVar) {
                          playBeep();
                          onBreakVar = true;
                          setOnBreak(true);
                          return breakTime;
                      } else if (prev <= 0 && onBreakVar) {
                          playBeep();
                          onBreakVar = false;
                          setOnBreak(false);
                          return breakTime;
                      }
                      return prev - 1;
                  })
                  nextDate += sec;
              }
          }, 30)
          localStorage.clear()
          localStorage.setItem('interval-id', interval)
      }
      if(timerOn) {
          clearInterval(localStorage.getItem('interval-id'));
      }
      setTimerOn(!timerOn)
  };

  const resetTime = () => {
      !timerOn && playBump();
      timerOn && controlTime();
      setDisplayTime(25*60);
      setBreakTime(5*60);
      setSessionTime(25*60);
  };

  return (
      <div className="everything">
          <link rel="stylesheet" href="./styleClock.css"></link>
          <h2>25 + 5 React Clock by swanktos</h2>
          <h2>{onBreak ? "Clock on Break" : "Clock on Session"}</h2>
          <div className="main-count">
              <div className="instrument">
                  <button onClick={controlTime}>
                      {timerOn ?
                          <i className="fas fa-pause-circle"></i> :
                          <i className="fas fa-play-circle"></i>
                      }
                  </button>
                  <button onClick={resetTime}>
                      <i className="fas fa-redo-alt"></i>
                  </button>
              </div>
              <h1>{formatTime(displayTime)}</h1>
          </div>
          <div className="break-session-div">
              <Length
              title={"Break Length"}
              changeTime={changeTime}
              type={"break"}
              time={breakTime}
              formatTime={formatTime}
              />
              <Length
              title={"Session Length"}
              changeTime={changeTime}
              type={"session"}
              time={sessionTime}
              formatTime={formatTime}
              />
          </div>
          <button className="mute" onClick={mutePrompt}>
          {onMute ? 
                  <i className="fas fa-volume-up"></i> : 
                  <i className="fas fa-volume-mute"></i>
              }
          </button>
      </div>
  )
};

function Length({title, changeTime, type, time, formatTime}) {
  return (
      <div className="time-sets-title">
          <h3>{title}</h3>
          <div className="time-sets">
              <button onClick={() => changeTime(-60, type)}><i className="fas fa-arrow-down"></i></button>
              <button onClick={() => changeTime(60, type)}><i className="fas fa-arrow-up"></i></button>
              <h4 className="adjust-length">{formatTime(time)}</h4>
          </div>
      </div>
  )
};

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
    }
})

  const playBump =() => {
    bump.currentTime = 0;
    bump.play()
  }

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
  }

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
    }
    if(/[+-/*]/.test(symbol)) {
      setDecimalTrigger(true)
      setZeroTrigger(true);
    }
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
    }
    setInput((prev) => prev + symbol)
    if (symbol === '.') {
      setDecimalTrigger(false)
    } else if (symbol === '0' && decimalTrigger) {
      setZeroTrigger(false)
    }
  }

  const compute = () => {
    playBump();
    setOutput(eval(input))
  }


  const inputBlank = (e) => {
  }

  const allClear = () => {
    playBump();
    setInput('');
    setOutput(0);
    setDecimalTrigger(true);
    setZeroTrigger(true);
  }

  const backSpace = () => {
    playBump();
    setInput((prev) => prev.split("").splice(0, prev.length-1).join(""))
  }

  return(
    <div className="wrapper">
      <link rel="stylesheet" href="./styleCalculator.css"></link>
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

  )
};

const audioClip = [
  {
    keyCode: 81,
    keyTrigger: 'Q',
    id: 'Heater-1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
  },
  {
    keyCode: 87,
    keyTrigger: 'W',
    id: 'Heater-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
  },
  {
    keyCode: 69,
    keyTrigger: 'E',
    id: 'Heater-3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
  },
  {
    keyCode: 65,
    keyTrigger: 'A',
    id: 'Heater-4',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
  },
  {
    keyCode: 83,
    keyTrigger: 'S',
    id: 'Clap',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
  },
  {
    keyCode: 68,
    keyTrigger: 'D',
    id: 'Open-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  },
  {
    keyCode: 90,
    keyTrigger: 'Z',
    id: "Kick-n'-Hat",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  },
  {
    keyCode: 88,
    keyTrigger: 'X',
    id: 'Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  },
  {
    keyCode: 67,
    keyTrigger: 'C',
    id: 'Closed-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  }
];

function AppDrum() {
  const [volume, setVolume] = React.useState(1);
  return(
      <div id="drum-machine">
          <link rel="stylesheet" href="./styleDrum.css"></link>
          {audioClip.map(clip => (
              <AppdmPad key={clip.id} clip={clip} volume={volume} />
          ))}
          <input
              type="range"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              min="0"
              max="1"
              className="w-100 py-4"
          />
      </div>
  )
};

function AppdmPad({clip, volume}) {
  const [active, setActive] = React.useState(false);
  const [color, setColor] = React.useState('#42f5a4');
  const colors = [
      'red', 'orange', 'yellow', '#DFFF00', 'green', '#00FF7F', 'cyan', '#F0FFFF', 'blue', 'violet', 'magenta', '#F33A6A'
  ];
  
  const getColorIndex = () => {
      setColor(colors[Math.floor(Math.random() * colors.length)])
  };

  React.useEffect(() => {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
          document.removeEventListener("keydown", handleKeyPress)
      }
  });

  const handleKeyPress = (e) => {
      if (e.keyCode === clip.keyCode) {
          playSound();
      }
  };

  const playSound = () => {
      setActive(true)
      setTimeout(() => setActive(false), 200)
      getColorIndex();
      const audioTag = document.getElementById(clip.keyTrigger);
      audioTag.volume = volume
      audioTag.currentTime = 0;
      audioTag.play()
  };

  return(
      <div
          onClick={playSound}
          className="btn"
          style={{backgroundColor: active ? color : '#636363'}}
      >
          <audio className="clip" id={clip.keyTrigger} src={clip.url} />
          {clip.keyTrigger}
      </div>
  )
};

ReactDOM.render(<App/>, document.getElementById("root"))