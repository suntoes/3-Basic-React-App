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
          <link rel="stylesheet" href="./3 apps/styleDrum.css"></link>
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