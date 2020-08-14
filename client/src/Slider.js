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
    <div className={`classes.root sliders`}>
      <Typography id="discrete-slider-small-steps" gutterBottom>
        {name}
      </Typography>
      <Slider
        defaultValue={time ? parseInt(time) : 0}
        value={time ? parseInt(time) : 0}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-small-steps"
        min={1}
        max={60}
        valueLabelDisplay="on"
        onChange={(e, v) => onChange(v)}
      />
    </div>
  );
};

export default DiscreteSlider;
