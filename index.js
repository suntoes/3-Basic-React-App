function App() {
  const [dTest, setdTest] = React.useState(false);
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
}

ReactDOM.render(<App/>, document.getElementById("root"))