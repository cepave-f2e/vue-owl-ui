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
<DualList items={labels} class={[s.dualGroup]} onChange={this.getDualData} />
```
API mode `<Dual />`:
- additional props `apiMode` and `leftLoading`  
- get left input box value by listener `onInputchange`
- get remove input value event by listener `onRemove`
```jsx
<DualList apiMode onChange={this.getInputValue} onRemove={this.removeInput} leftLoading={true} />
```

## Demo
