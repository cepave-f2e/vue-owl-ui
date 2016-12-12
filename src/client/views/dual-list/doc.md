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
<Dual.Group items={labels} class={[s.dualGroup]} onChange={this.getDualData} />
```

## Demo
