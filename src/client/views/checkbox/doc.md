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
```
Make a checkbox named `all`. It can control other checkboxes
```jsx
<Checkbox.Group>
  <Checkbox name="all" checked={true}>All</Checkbox>
  <Checkbox name="1">Pikachu</Checkbox>
  <Checkbox name="2">Eevee</Checkbox>
</Checkbox.Group>
```
Use `onChange` as a listener to get data from `$emit('change')`
It works both on `<Checkbox>` and `<Checkbox.Group>`
```jsx
//Define a Function to handle onChange and get Checkbox.Group data
const getCheckboxData = (data) => {
  console.log(data)
}

<Checkbox.Group onChange={getCheckboxData}>
  <Checkbox name="1">Pikachu</Checkbox>
  <Checkbox name="2">Eevee</Checkbox>
</Checkbox.Group>
```

## Demo
