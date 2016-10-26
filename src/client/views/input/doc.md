# Input

## Props

```js
props: {
  name: {
    type: String,
    default: 'input',
  },
  loading:{
    type: Boolean,
    default: false,
  },
  icon: {
    //['typ', 'fill']
    type: Array,
  },
  status: {
    //status can be 'normal', 'success', or 'error'
    type: String,
    default: 'normal'
  },
  placeholder: {
    type: String,
    default: ''
  }
}
```

## Usage

```jsx
//get input value be this.$refs.inputRef.getInputValue()
<Input name="demo" icon={['search', '#e6175c']} status="normal" placeholder="type some words.." ref="inputRef"/>

//use password attribute to switch input type
<Input password={true}/>
```

## Demo
