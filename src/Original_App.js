import React, { Component } from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

// Styling For Button
const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

class App extends React.Component {
  state = {
    zip: '',
    current: null,
    forecast: null,
  };

  // Handles Changes To The Zip Field
  handleChange = zip => event => {
    this.setState({ [zip]: event.target.value });
  };

  //Current Weather Data
  handleClick = () => {
    if (this.state.zip === '') return;

    fetch('http://api.openweathermap.org/data/2.5/weather?zip=' + this.state.zip + ',us&APPID=09cf8b76fde0210ec225a3bf23ccfdc0')
      .then(response => {
        return response.json();
      })
      .then(currentData => {
        this.setState({ current: currentData });
        console.log(currentData);
      });

    // Five Day Forcast
    fetch('http://api.openweathermap.org/data/2.5/forecast?zip=' + this.state.zip + ',us&APPID=09cf8b76fde0210ec225a3bf23ccfdc0')
      .then(response => {
        return response.json();
      })
      .then(forecastData => {
        this.setState({ forecast: forecastData });
      });
  };

  render() {
    const { classes } = this.props;
    console.log(this.state);
    return (
      <div className='App'>
        <TextField label=' Enter Zip Code' value={this.state.zip} onChange={this.handleChange('zip')} margin='normal' />
        <Button variant='contained' color='primary' className={classes.button} onClick={this.handleClick}>
          GO
        </Button>
        Current Weather:
        <h1>{this.state.current ? this.state.current.main.temp : ''}</h1>
        <h1>{this.state.current ? this.state.current.main.humidity : ''}</h1>
        Forecast:
        {this.state.forecast
          ? this.state.forecast.list.map(forecast => (
              <div>
                <h3>Temp: {forecast.main.temp}</h3>
                <h3>Humidity: {forecast.main.humidity}</h3>
              </div>
            ))
          : null}
      </div>
    );
  }
}

export default withStyles(styles)(App);
