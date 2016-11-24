# Radio and RadioGroup

## props

```js
const Radio = {
  props: {
    on: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    }
  },
}
```

## Usage
```jsx
<Radio.Group>
  <Radio name="winnieThePooh" on={true}>Winnie the Pooh</Radio>
  <Radio name="piglet">Piglet</Radio>
  <Radio name="tigger">Tigger</Radio>
</Radio.Group>
```
Use `onChange` as a listener to get data from `$emit('change')`
It works both on `<Radio>` and `<Radio.Group>`
```jsx
//Define a Function to handle onChange and get Raio.Group data
const getRadioData = (data) => {
  console.log(data)
}

<Radio.Group onChange={getRadioData}>
  <Radio name="piglet">Piglet</Radio>
  <Radio name="tigger">Tigger</Radio>
  <Radio name="winnieThePooh" on={true}>Winnie the Pooh</Radio>
</Radio.Group>
```

## Demo
