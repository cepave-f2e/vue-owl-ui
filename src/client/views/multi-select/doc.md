# MultiSelect

## Props

```js
props: {
  options: {
    type: Array,
    required: true
  },
  selectedOpts: {
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
  isDisabled: {
    type: Boolean,
    default: false
  },
  caseInsensitive: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
},
```

## Usage
The props `options` must be `Array Object` and `selectedOpts` must be an `Array of Numbers`  
Give `displayKey` to determine what should be display in the option list
```jsx
const options = [
  { value: 'vulpix', id: 23 },
  { value: 'caterpie', id: 26 },
  { value: 'pikachu', id: 24 }
]
const selectedOpts = [0, 1]
<MultiSelect selectedOpts={this.selectedItems} options={this.options} displayKey="value" />
```
1. Use `onChange `as a listener to get data from `$emit('change')`
2. Use `caseInsensitive` props to determine whether the search feature is case insensitive
3. Use `loading` to show loading status
4. get `<MultiSelect />` data by `this.$refs.multiselect.selectedIdx`
```jsx
<MultiSelect selectedOpts={this.selectedItems} 
             options={this.options} 
             displayKey="value"
             onChange={this.getData} 
             caseInsensitive 
             loading
             ref="multiselect"
/>
```

## Demo
