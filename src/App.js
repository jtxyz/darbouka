import React, { Component } from 'react';
import './App.css';
/* global YT,  */

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
        playerVars: {
          'controls': 0, 
          'playsinline': 1,
        },
      });

      this.setState({player: player})
    };

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
        <div id="player" />
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

    if (this.state.currentCount <= 0) {
      this.props.timesUp();
      this.setState({ 
        currentCount: this.props.startingTime * 60 * 1000
      });
      return;
    }

    this.setState({ 
      currentCount: this.state.currentCount - 1000 
    });
  }

  render() {
      return (<section className="remaining">{
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
        tracks: [{
          id: 'GcHL8efKKPE',
          name: 'The Clash - The Magnificent Seven'
        }, {
          id: 'WQYsGWh_vpE',
          name: 'Portishead - Roads'
        }, {
          id: '5OHBEmQtNIg',
          name: 'Nirvana - Where Did You Sleep Last Night'
        }]
      },
      {
        length: 6,
        tracks: [{
          id: 'W6FZwVvS8_8',
          name: 'The Clash - Police & Thieves'
        }, {
          id: 'so-L12LFRR8',
          name: 'New Order - Your Silent Face'
        }, {
          id: 'evqx5HLm9iM',
          name: 'Daft Punk - One More Time / Aerodynamic'
        }, {
          id: 'O4o8TeqKhgY',
          name: 'Grandmaster Flash – The Message'
        }]
      },
      {
        length: 10,
        tracks: [{
          id: '73_UmjJBi6E',
          name: 'The Doors - The End'
        }, {
          id: 'WZbE2VvZCqk',
          name: 'Idris Muhammad - Loran\'s Dance'
        },]
      }
    ];
  }

  handleClick(time) {
    let isRunning = this.state.time !== time || !this.state.isRunning;
    
    let track;
    if (isRunning) {
      let tracks = this.library.find(i => i.length === time).tracks;
      track = tracks[Math.floor(Math.random() * tracks.length)]; 
    } else {
      track = { 
        id: this.state.trackToPlay,
        name: this.state.trackName
      };
    }

    this.setState({
      time: time,
      isRunning: isRunning,
      trackToPlay: track.id,
      trackName: track.name,
    });
  }

  timesUp() {
    this.setState({
      isRunning: false
    });
  }

  renderButtons() {
    return this.library.map(i => i.length).map(i => {
      const className = this.state.time === i ? 'active' : '';
      const action = this.state.time === i && this.state.isRunning ? 'fa-pause' : 'fa-play';
      return (
        <button key={i}
          className={className}
          onClick={() => this.handleClick(i)}
        >
        { `${i}min ` }<i className={'fa ' + action}/>
        </button>
      )
    });
  }

  render() {
    return (
      <div className="App">
        <div className="title">
          <img alt="logo" src="logo.svg" />
          <h1>Darbouka</h1>
          <p>Musical timer for creative sessions</p>
        </div>
        <div className="status-panel">
          <div className="vertical-centre">
            <Timer startingTime={this.state.time} 
              isRunning={this.state.isRunning}
              timesUp={() => this.timesUp()}
            />
            <section className="trackName">{this.state.trackName}</section>
          </div>
        </div>
        <div className='buttons'>{ this.renderButtons() }</div>
        <YouTube track={this.state.trackToPlay} 
          playing={this.state.isRunning}
        />
      </div>
    );
  }
}

export default App;
