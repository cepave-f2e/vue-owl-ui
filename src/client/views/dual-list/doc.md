# DualList

## Props
```js
props: {
  items: { //list on the left
    type: Array,
    default: () => {
      return []
    }
  },
  selectedItems: { //list on the right
    type: Array,
    default: () => {
      return []
    }
  },
  displayKey: {
    type: String,
    default: '',
    required: true
  },
  caseInsensitive: {
    type: Boolean,
    default: false
  },
  apiMode: {
    type: Boolean,
    default: false
  },
  leftLoading: {
    type: Boolean,
    default: false
  }
}
```

## Usage
The props -- `items` and `selectedItems` must be `Array Object`.  
Give `displayKey` to determine what should be display in a single list
```jsx
const labels = [
  { name: 'Squirtle', id: '1' }, { name: 'Caterpie', id: '2' },
  { name: 'Raticate', id: '3' }, { name: 'Fearow', id: '4' }
]
<DualList items={labels} selectedItems={selectedLabel} displayKey="name" caseInsensitive />
```
Use `onChange `as a listener to get data from `$emit('change')`
```jsx
<DualList items={labels} onChange={this.getDualData} />
```
Use `caseInsensitive` props to determine whether the search feature is case insensitive
```jsx
<DualList items={labels} caseInsensitive />
```
API mode `<Dual />`:
- additional props `apiMode` and `leftLoading`  
- get left input box value by listener `onInputchange`
- get remove input value event by listener `onRemove`
```jsx
<DualList apiMode onChange={this.getInputValue} onRemove={this.removeInput} leftLoading={true} />
```

## Demo
