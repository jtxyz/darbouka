import React, { Component } from 'react';
import './App.css';
/* global YT */

class YouTube extends Component {

  constructor(props) {
    super(props);
    this.state = {
      player: null,
    };
  }

  componentDidMount() {
    window['onYouTubeIframeAPIReady'] = () => {
      const player = new YT.Player('player', {
        height: '160',
        width: '160',
        playerVars: {'controls': 0}
      });

      this.setState({player: player})
    }

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.playing !== nextProps.playing) {
      if (nextProps.playing) {
        this.state.player.playVideo();
      } else {
        this.state.player.pauseVideo();
      }
    }

    if (this.props.track !== nextProps.track) {
      this.state.player.loadVideoById(nextProps.track);
    }
  };

  render() {
    return(
      <div id="player-wrapper">
        <div id="player"></div>
      </div>
    )
  }
}

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCount: 0,
      intervalId: null,
    };
  }

  componentDidMount() {
     const intervalId = setInterval(() => this.tick(), 1000);
     this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
     clearInterval(this.state.intervalId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.startingTime !== nextProps.startingTime) {
      this.setState({ 
        currentCount: nextProps.startingTime * 60 * 1000
      });
    }
  };

  tick() {
    if (!this.props.isRunning) {
      return;
    }

    this.setState({ 
      currentCount: this.state.currentCount - 1000 
    });
  }

  render() {
      return (<section>{
        new Date(this.state.currentCount)
          .toISOString()
          .substr(14, 5)
          .replace(/^0/, '')
        }
      </section>);
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null,
      isRunning: false,
    };

    this.library = [
      {
        length: 5,
        tracks: ['GcHL8efKKPE']
      },
      {
        length: 6,
        tracks: ['W6FZwVvS8_8']
      },
      {
        length: 7,
        tracks: []
      },
      {
        length: 8,
        tracks: []
      }
    ];
  }

  handleClick(time) {

    let isRunning = this.state.time !== time || !this.state.isRunning;
    let track = this.library.find(i => i.length === time).tracks[0];

    this.setState({
      time: time,
      isRunning: isRunning,
      trackToPlay: track,
    });
  }

  renderButtons() {
    return this.library.map(i => i.length).map(i =>
        <input type='button' key={i}
          value={ i + "min" }
          className={(this.state.time === i ? 'active' : '')}
          onClick={() => this.handleClick(i)}
        />);
  }

  render() {
    return (
      <div className="App">
        <div className="time">
          <Timer startingTime={this.state.time} isRunning={this.state.isRunning} />
        </div>
        <div className='buttons'>{ this.renderButtons() }</div>
        <YouTube track={this.state.trackToPlay} playing={this.state.isRunning}/>
      </div>
    );
  }
}

export default App;
