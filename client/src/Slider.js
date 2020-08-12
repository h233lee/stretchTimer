import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

function valuetext(value) {
  return `${value} Minutes`;
}

const DiscreteSlider = ({ onChange, time, name }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-small-steps" gutterBottom>
        {name}
      </Typography>
      <Slider
        defaultValue={time}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-small-steps"
        step={5}
        marks
        min={0}
        max={60}
        valueLabelDisplay="on"
        onChangeCommitted={(e, v) => onChange(v)}
      />
    </div>
  );
};

export default DiscreteSlider;
