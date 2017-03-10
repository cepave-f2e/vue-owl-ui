## Props
```js
categories: {
  type: Array,
  default: () => [
    {
      name: 'cat1',
      value: 'cat1',
      on: true,
    }
  ]
},
placeholder: {
  type: String,
  default: ''
},
items: {
  type: Array,
  default: () => [
    {
      name: '',
      checked: false,
      children: [
        {
          name: '',
          value: 'uniq',
          checked: false,
        }
      ]
    }
  ]
},
loading: {
  type: Boolean,
  default: false,
},
text: {
  type: Object,
  default() {
    return {
      selectAll: 'select all',
      clearAll: 'clear all',
      selected: 'selected',
      selectedItems: 'selected items',
      removeAll: 'remove all',
    }
  }
}
```
## Events

### query(data)
Triggerd  by `enter`
- `data.value` Get input value.
- `data.catgory` Get the catgory of query.

### change(data)
- `data.selectedItems` Get selected items in store.
