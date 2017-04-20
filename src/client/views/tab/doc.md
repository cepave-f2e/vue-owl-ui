# Tab

## Props of Tab.Head and Tab.Content
`name` of `Tab.Head` and `Tab.Content` are required, they will be matched
```js
{
  name: 'Tab.Head',
  props: {
    isSelected: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: '',
      required: true
    }
  }
},
{
  name: 'Tab.Content',
  props: {
    name: {
      type: String,
      default: '',
      required: true
    }
  }
}
```

## Usage

- The sequence of `<Tab.Head>` and `<Tab.Content>` should be placed in order, eg. `1`,`2`,...or `Alarms`, `Alarm History`  
- Must add attribute `slot="tabHead"` in `<Tab.Head>` and `slot="tabContent"` in `<Tab.Content>`
- Use `onChange` as a listener to get data from `$emit('change')`

```jsx
const getTabData = (data) => {
  console.log(data)
}
<Tab onChange={getTabData}>
  <Tab.Head slot="tabHead" name="1">Tab1</Tab.Head>
  <Tab.Head slot="tabHead" isSelected={true} name="2">Tab2</Tab.Head>
  <Tab.Content slot="tabContent" name="1">
    <br />Hello, I am tab one
  </Tab.Content>
  <Tab.Content slot="tabContent" name="2">
    <br />This is tab two
  </Tab.Content>
</Tab>
```
It can be placed like this as well
```jsx
<Tab>
  <Tab.Head slot="tabHead" name="1">Tab1</Tab.Head>
  <Tab.Content slot="tabContent" name="1">
    <br />Hello, I am tab one
  </Tab.Content>
  <Tab.Head slot="tabHead" isSelected={true} name="2">Tab2</Tab.Head>
  <Tab.Content slot="tabContent" name="2">
    <br />This is tab two
  </Tab.Content>
</Tab>
```

## Demo
