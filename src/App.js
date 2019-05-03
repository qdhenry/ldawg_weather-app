import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
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
    if (this.state.zip === '') return;

    fetch('http://api.openweathermap.org/data/2.5/weather?zip=' + this.state.zip + ',us&APPID=09cf8b76fde0210ec225a3bf23ccfdc0&units=imperial')
      .then(response => {
        return response.json();
      })
      .then(currentData => {
        console.log(currentData);
        let currentTemp = currentData.main.temp;
        if (currentData.weather) {
          this.setState({ weather0: currentData.weather[0].description });
          if (currentData.weather[1]) {
            this.setState({ weather1: currentData.weather[1].description });
          }
        }

        this.setState({ current_temp: currentTemp });
        this.setState({ current: currentData });
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
    return (
      <Grid className='App'>
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Typography component='h1' variant='h5'>
              Weather App
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
          </Grid>
        </main>
      </Grid>
    );
  }
}

export default withStyles(styles)(App);
