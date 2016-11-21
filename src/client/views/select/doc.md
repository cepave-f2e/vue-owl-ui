# Select

## Props

```js
props: {
  options: {
    type: Array,
    required: true,
  },

  optionsRender: {
    type: Function
  },

  isOpened: {
    type: Boolean,
    default: false,
  },

  isDisabled: {
    type: Boolean,
    default: false,
  },

  name: {
    type: String,
    default: ''
  },

  onChange: {
    type: Function,
  },
},
...
```

## Options data structure
The `options` of props must be an `Array Object`.

```json
[
  { value: '1d', title: '1 day' },
  { value: '3d', title: '3 days', selected: true },
  { value: '5d', title: '5 days' },
]
```
### options.value [String]
Option's value

### options.title [String]
Displayed title

### options.selected [Boolean]
Set the default selected option

### options.render [Function]
Custom render template.

## Usage
```jsx
data() {
  options: [
    { value: '1d', title: '1 day' },
    { value: '3d', title: '3 days', selected: true },
    { value: '5d', title: '5 days' },
  ]
},

methods: {
  selectOnChange(data) {
    console.log(data)
  }
},

render(h) {
  const { selectOnChange, options } = this
  return (
    <Select onChange={selectOnChange} options={options} />
  )
}
```

## The value
You also can get value directly thro `ref`

```jsx
mounted() {
  // gets value
  this.$refs.mySelect.value
},

render(h) {
  <Select ref="mySelect">
    ...
  </Select>
}
```
