# DualList

## Props
```js
props: {
  items: { //list on the left
    type: Object,
    default: () => {
      return {}
    }
  },
  selectedItems: { //list on the right
    type: Object,
    default: () => {
      return {}
    }
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

```jsx
const labels = {
  1: 'Squirtle', 2: 'Caterpie', 3: 'Raticate', 4: 'Fearow', 5: 'Clefairy',
}
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
