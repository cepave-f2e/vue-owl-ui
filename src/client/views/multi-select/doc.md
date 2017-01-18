# MultiSelect

## Props

```js
props: {
  options: {
    type: Array,
    required: true
  },
  selectedIdx: {
    type: Array,
    required: true
  },
  displayKey: {
    type: String,
    required: true
  },
  isOpened: {
    type: Boolean,
    default: false,
  },
},
```

## Usage
The props `options` must be `Array Object` and `selectedIdx` must be an `Array of Numbers`  
Give `displayKey` to determine what should be display in the option list
```jsx
const options = [
  { value: 'vulpix', id: 23 },
  { value: 'caterpie', id: 26 },
  { value: 'pikachu', id: 24 },
  { value: 'charmander', id: 25 },
]
const selectedIdx = [0, 1]
<MultiSelect selectedIdx={this.selectedItems} options={this.options} displayKey="value" />
```
Use `onChange `as a listener to get data from `$emit('change')`
```jsx
<MultiSelect selectedIdx={this.selectedItems} 
             options={this.options} 
             displayKey="value"
             onChange={this.getData} 
/>
```

## Demo
