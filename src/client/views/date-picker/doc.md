# DatePicker

## Props

```js
yearMonth: {
  type: Array,
  require: true,
  default: () => [(new Date).getFullYear(), (new Date).getMonth() + 1]
},

format: {
  type: String,
  default: 'yyyy/mm/dd',
},

min: {
  type: Date,
},

max: {
  type: Date,
},

firstDayOfWeek: {
  type: Number,
  default: 1,
},

colorfulWeekend: {
  type: Boolean,
  default: false,
},

open: {
  type: Boolean,
  default: false
},

defaultValue: {
  type: String,
  default: ''
},
```

## Events
### pick(data) 
#### data.value 
Get value of input.
#### data.year
Get the year.
#### data.month
Get the month.
#### data.date
Get the date of month.
#### data.day
Get the day of week.
#### data.Date
Get Date instance.

## Demo
