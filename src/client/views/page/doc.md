# Page

## props

```js
props: {
  limit: {
    type: Number,
    default: 10,
    required: true,
  },

  total: {
    type: Number,
    required: true,
  },

  typ: {
    type: String,
    default: 'pages', // `pages`, `button`, `text` and `number`.
  },

  align: {
    type: String,
    default: 'center' // `left`, `center`, `right` and `around`.
  },

  toPage: {
    type: Number,
    default: 1,
  }
},
...
```

### props.typ
The pagination's type, default is `pages`. Otherwise is `button`, `text` and `number`.


### props.align
The pagination's alignment, default is `center`. Otherwise is `left`, `right` and `around`.

## Usage

```jsx
<Page total={500} limit={20} />
```

## Events
### page({ page })
It'll be triggered when switch page.

## Get Current Page
You can access the `page` directly through `ref`.

```jsx
mounted() {
  this.$refs.myPager.page // get page
},

render(h) {
  return (
    <Page total={500} limit={20} ref="myPager" />
  )
}
```

## The all  looks of Page's type

