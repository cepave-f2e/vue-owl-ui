# Input

## Props

```js
props: {
  name: {
    type: String,
    default: 'input',
  },
  icon: {
    type: Array,
  },
  status: {
    type: String,
    default: 'normal'
  },
  val: {
    type: String
  },
  placeholder: {
    type: String,
    default: ''
  },
  loading:{
    type: Boolean,
    default: false,
  },
  password: {
    type: Boolean,
    default: false
  },
  x: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
}
```

## Usage

get input value from `this.$refs.inputRef.value`
```jsx
<Input name="demo" icon={['search', '#919799']} status="normal" placeholder="type some words.." ref="inputRef" />
```
use `loading` props to show loading pie
```jsx
<Input loading={true} />
```
use `password` props to switch input type
```jsx
<Input password={true} />
```
use props `x` and `x` icon to remove value when clicking on `x`
```jsx
<Input icon={['search', '#919799']} x={true} />
```
use `required` props to add `*` beside `<Input>`
```jsx
<Input required={true} />
```

get `onClickX` event by `$on` and `$emit`
```jsx
mounted() {
  this.$on('handleClickOnX', this.handleClickOnX)
},
methods: {
  handleClickOnX(data) {
    console.log(data)
  }
}
```

Use `nativeOn-keypress={this.handleClick}` to bind keypress event
```jsx
<Input status="success" nativeOn-keypress={this.handleKeyPress} />
```

## Demo
