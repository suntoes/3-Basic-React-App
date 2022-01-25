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
      let min = Math.floor(time / 60);
      let sec = time % 60;

      return (
        (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)
      );
    };
  
    const [bump, setBump] = React.useState(
        new Audio("https://raw.githubusercontent.com/darklight721/keyboard-sounds/master/audio/key_press.mp3")
    );
  
    const playBeep =() => {
        breakAudio.currentTime = 0;
        breakAudio.play();
    };
  
    const playBump =() => {
        if (onMute) {
            bump.volume = 0;
        } else {
            bump.volume = 1;
        };
        bump.currentTime = 0;
        bump.play();
    };
  
    const mutePrompt = () => {
        playBump();
        setOnMute(!onMute);  
    };
  
    const changeTime = (amount, type) => {
        playBump();
        switch(type) {
            case "break":
                if (( breakTime <= 60 && amount < 0) || (breakTime >= 3600 && amount > 0)) {
                    return
                };
                setBreakTime((prev) => prev + amount);
                break;
            case "session":
                if (( sessionTime <= 60 && amount < 0) || (sessionTime >= 3600 && amount > 0)) {
                    return
                };

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
        let onBreakVar = onBreak;
        
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
            }, 30);

            localStorage.clear();
            localStorage.setItem('interval-id', interval);
        };

        if(timerOn) {
            clearInterval(localStorage.getItem('interval-id'));
        };

        setTimerOn(!timerOn);

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
            <link rel="stylesheet" href="./3 apps/styleClock.css"></link>
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
    );
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
    );
  };