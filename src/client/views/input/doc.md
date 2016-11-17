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
  }
}
```

## Usage

```jsx
//get input value from this.$refs.inputRef.value
<Input name="demo" icon={['search', '#919799']} status="normal" placeholder="type some words.." ref="inputRef" />

//use loading props to show loading pie
<Input loading={true} />

//use password props to switch input type
<Input password={true} />

//use `x` icon to remove value when clicking on `x`
<Input icon={['search', '#919799']} x={true} />

//get onClickX event by $on and $emit
mounted() {
  this.$on('handleClickOnX', this.handleClickOnX)
},
methods: {
  handleClickOnX(data) {
    console.log(data)
  }
}

//bind `on-keypress` event on <div> rether than <Input />
<div on-keypress={this.handleKeyPress}>
  <Input status="success" />
</div>
```

## Demo
