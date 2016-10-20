# Checkbox and CheckboxGroup

## Props

```js
const Checkbox = {
  props: {
    checked: {
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
  }
}
const Checkbox.Group = {
  props: {
    onChange: {
      type: Function
    }
  }
}
```

## Usage

```jsx
<Checkbox.Group>
  <Checkbox name="1">Pikachu</Checkbox>
  <Checkbox name="2">Eevee</Checkbox>
</Checkbox.Group>

//Make a checkbox named `all`. It can control other checkboxes
<Checkbox.Group>
  <Checkbox name="all" checked={true}>All</Checkbox>
  <Checkbox name="1">Pikachu</Checkbox>
  <Checkbox name="2">Eevee</Checkbox>
</Checkbox.Group>

//Define a Function to handle onChange and get Checkbox.Group data by its parameter
const getCheckboxData = (data) => {
  console.log(data)
}

<Checkbox.Group onChange={getCheckboxData}>
  <Checkbox name="1">Pikachu</Checkbox>
  <Checkbox name="2">Eevee</Checkbox>
</Checkbox.Group>
```

## Demo
