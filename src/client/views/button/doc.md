# Button

## Props

```js
{
  name: 'Button',
  props: {
    status: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
},
{
  name: 'ButtonGroup',
  props: {
    options: {
      type: Array,
      required: true
    }
  }
}
```

## Options data structure for `<Button.Group>`
The `options` of props must be an `Array Object`.

```json
[
  { value: 'winnie', title: 'Winnie The Pooh' },
  { value: 'piglet', title: 'Piglet' },
  { value: 'tigger', title: 'Tigger', selected: true }
]
```

## Usage
### Button
There are four kinds of button style: `default`, `primary`, `outline`, `primaryOutline`
```jsx
<Button>
  <Icon typ="plus" size={16} />
  新增公告
</Button>
<Button status="primaryOutline">關閉</Button>
```
Set width of the button to 50% relative to its upper layer
```jsx
<Button status="primary" class={[s.buttonBig]}>Submit</Button>
.buttonBig {
  width: 50%;
}
```
Use `nativeOn-click={this.handleClick}` to bind click event
```jsx
<Button nativeOn-click={this.handleClick}>Click me</Button>
```
### Button Group  

#### Methods
- `setOptions([newOptions])` for dynamic change options  
- `setSelectedOption(index)` for dynamic change the selected options

- Use `onChange` as a listener to get data from `$emit('change')`
```jsx
data() {
 return {
   options: [
     { value: 'winnie', title: 'Winnie The Pooh' },
     { value: 'piglet', title: 'Piglet' },
     { value: 'tigger', title: 'Tigger', selected: true }
   ]
 }
},

methods: {
  getButtonGroupData((data) => console.log(data))
},

render(h) {
  return (
    <Button.Group options={this.options} onChange={this.getButtonGroupData} />
  )
}
```
## Demo
