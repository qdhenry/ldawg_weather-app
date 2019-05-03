import React from 'react';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
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
  handleClick = e => {
    e.preventDefault();
    if (this.state.zip.length < 5 || this.state.zip === '') {
      alert('Please enter a valid zipcode');
      return;
    }

    // Check if zip code submited is a number, if not return error message
    let zipcodeTest = Number(this.state.zip);
    if (isNaN(zipcodeTest)) {
      alert('Please enter a valid zipcode');
      return;
    }

    fetch('http://api.openweathermap.org/data/2.5/weather?zip=' + this.state.zip + ',us&APPID=' + process.env.REACT_APP_WEATHER_API_KEY + '&units=imperial')
      .then(response => {
        return response.json();
      })
      .then(currentData => {
        let currentTemp = currentData.main.temp;
        if (currentData.weather) {
          this.setState({ weather0: currentData.weather[0].description });
          if (currentData.weather[1]) {
            this.setState({ weather1: currentData.weather[1].description });
          }
        }

        this.setState({ current_temp: currentTemp });
        this.setState({ current: currentData });
      })
      .then(res => {
        // Five Day Forcast
        fetch('http://api.openweathermap.org/data/2.5/forecast?zip=' + this.state.zip + ',us&APPID=' + process.env.REACT_APP_WEATHER_API_KEY + '&units=imperial')
          .then(response => {
            return response.json();
          })
          .then(forecastData => {
            forecastData = forecastData.list
              .map(item => {
                // Got the date and used Moment to generate the Weekday in order for the day to be nicely displayed in the UI of the 5 day forecast.
                let m = moment(item.dt_txt.split(' ')[0], 'YYYY-MM-DD');
                m = m.format('dddd');
                return {
                  day_of_week: m,
                  dt_txt: item.dt_txt,
                  weather: item.weather,
                  main: item.main,
                };
              })
              .filter(data => {
                // console.log(data.dt_txt);
                // Mapped the forcast data that I needed, I filtered to return only the weather // timestamped with 00:00:00
                let dttext = data.dt_txt.split(' ');
                console.log(dttext);
                let time = dttext[1];
                if (time === '00:00:00') {
                  return data;
                }
              });
            this.setState({ forecast: forecastData });
          });
      })
      .catch(e => {
        alert('Invalid zip code provided!');
        console.log(e);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid className='App'>
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper} id='MainTop'>
            <Typography component='h1' variant='h2'>
              Weather App
            </Typography>

            <Typography component='h1' variant='h6'>
              created by: Lawerence Williams
            </Typography>

            <form className={classes.form}>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='zipcode'>Zipcode</InputLabel>
                <Input id='zipcode' name='zipcode' value={this.state.zip} onChange={this.handleChange('zip')} autoComplete='zipcode' autoFocus />
              </FormControl>
              <Button type='submit' fullWidth variant='contained' onClick={this.handleClick} color='primary' className={classes.submit}>
                Get Weather!
              </Button>
            </form>
          </Paper>
          <Grid container className={classes.root} spacing={16}>
            <Grid item xs={12}>
              <h1>{this.state.current ? this.state.current.name : ''}</h1>
            </Grid>
            {this.state.current_temp ? (
              <Grid item xs={4}>
                <Paper className={classes.paper} m={0}>
                  <Grid container>
                    <Grid item>
                      Current Temp <br />
                      <h2>
                        {this.state.current ? this.state.current.main.temp : ''}
                        <span>&#8457;</span>
                      </h2>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ) : (
              ''
            )}
            {this.state.current_temp ? (
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  Todays High <br />
                  <h2>
                    {this.state.current ? this.state.current.main.temp_max : ''}
                    <span>&#8457;</span>
                  </h2>
                </Paper>
              </Grid>
            ) : (
              ''
            )}
            {this.state.current_temp ? (
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  Todays Low <br />
                  <h2>
                    {this.state.current ? this.state.current.main.temp_min : ''}
                    <span>&#8457;</span>
                  </h2>
                </Paper>
              </Grid>
            ) : (
              ''
            )}
            {this.state.weather0 ? (
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  Weather Conditions <br />
                  <h2>
                    Expect&nbsp;
                    {this.state.weather0 ? this.state.weather0 : ''}
                    {this.state.weather1 ? ` and ${this.state.weather1}` : ''}
                  </h2>
                </Paper>
              </Grid>
            ) : (
              ''
            )}
            <Grid item xs={12}>
              <h1>{this.state.forecast ? `Your 5 Day Weather Forecast` : ''}</h1>
            </Grid>
            {this.state.forecast
              ? this.state.forecast.map(day => (
                  <Grid item xs={4} sm={4}>
                    <Paper className={classes.paper}>
                      <h2>{day.day_of_week}</h2>
                      <h3>
                        Temp
                        <br />
                        {day.main.temp}
                        {/* adds symbol for fahrenheit  */}
                        <span>&#8457;</span>
                      </h3>
                      <p>{day.weather[0].description}</p>
                    </Paper>
                  </Grid>
                ))
              : null}
          </Grid>
        </main>
      </Grid>
    );
  }
}

export default withStyles(styles)(App);
