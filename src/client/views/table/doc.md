# Table

## Props

```js
heads: {
  type: Array,
  required: true
},
rows: {
  type: Array,
  required: true
},
feet: {
  type: Array,
  default: () => [],
},
typ: {
  type: String,
  default: 'base'
  //bordered, striped, flat
}
```

## Usage
There are 4 type of `Table` styles: `base`, `bordered`, `striped`, and `flat`  

Must define props `heads` and `rows` in this way:  
use `Array Object`, `col` means column name, `width` is column width and the total of `width` should be `100%`

```js
heads: [
  { col: 'pokemon', width: '25%' },
  { col: 'chinese_name', width: '25%' },
  { col: 'type', width: '25%' },
  { col: 'attack', width: '25%' }
]
rows: [
  { pokemon: 'Bulbasaur', chinese_name: '妙蛙種子', type: 'Grass Poison', attack: '35' },
  { pokemon: 'Charmander', chinese_name: '小火龍', type: 'Fire', attack: '35' },
  { pokemon: 'Squirtle', chinese_name: '傑尼龜', type: 'Water', attack: '35' },
  { pokemon: 'Pikachu', chinese_name: '皮卡丘', type: 'Electric', attack: '50' }
]
```
Add table feet(optional) in this way: use `Array Object`
```js
feet: [
  { val: 'total', colspan: '3' },
  { val: '155', colspan: '1' }
]
```
```jsx
<Table heads={this.heads} rows={this.rows} feet={this.feet} typ="striped" />
```

## Demo
