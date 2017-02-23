# Grid

## Props

```js
heads: {
  type: Array,
  required: true,
  default: () => [
    {
      name: 'Head',
      key: '',
      sort: -1,
      sortKey: '',
      width: '20%'
    }
  ],
},

rows: {
  type: Array,
  default: () => [],
},

rowsRender: {
  type: Function
},

loading: {
  type: Boolean,
  default: false,
}
```

### heads.name 
Displayed table head's name.
### *heads.key
Defined unique key field of each column in row.
### heads.sort
`1` is sort by descending, `0` is sort by ascending.
### heads.sortKey
If no defined it'll use `key`.
### heads.width
Defined the `width` of each column. Clould be `px` or `%` if omit unit it'll be `px`.

### rowsRender 
Custom rows renderer.

```js
rowsRender({ row, index }) {
  return [
    <Grid.col><b>{row.name}</b></Grid.col>,
    <Grid.col>{row.email}</Grid.col>,
  ]
}
```

## Event

### sort(data)
Custom sort.
### data.sort
Get sort way. 
### data.key 
Get sort key.

## Usage
