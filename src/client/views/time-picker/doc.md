# TimePicker

## Props

```js
props: {
  start: {
    type: String,
    default: '09:00',
  },
  end: {
    type: String,
    default: '22:00',
  },
  step: {
    type: Number,
    default: 15, // mins
  },
  open: {
    type: Boolean,
    default: false,
  }
},
```

## Events

### change(data)

#### data.time 
Gets selected time.

## Example
