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
    },
    onChange: {
      type: Function,
    }
  },
}
const Radio.Group = {
  props: {
    onChange: {
      type: Function,
    },
  }
}
```

## Usage
```jsx
<Radio.Group>
  <Radio name="winnieThePooh" on={true}>Winnie the Pooh</Radio>
  <Radio name="piglet">Piglet</Radio>
  <Radio name="tigger">Tigger</Radio>
</Radio.Group>

//Define a Function to handle onChange and get Raio.Group data by its parameter
const getRadioData = (data) => {
  console.log(data)
}

<Radio.Group onChange={getRadioData}>
  <Radio name="winnieThePooh" on={true}>Winnie the Pooh</Radio>
  <Radio name="piglet">Piglet</Radio>
  <Radio name="tigger">Tigger</Radio>
</Radio.Group>
```

## Demo
