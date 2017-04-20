# DatePicker

## Props

```js
yearMonth: {
  type: Array,
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
  default: <Today>
},
```

## Events
### next(data)

### prev(data)

### pick(data) 
`data.value` 
Get value of input.

`data.year` 
Get the year.

`data.month` 
Get the month.

`data.date` 
Get the date of month.

`data.day` 
Get the day of week.

`data.Date` 
Get Date instance.

## Demo
