# Icon

## Props
```js
props: {
  typ: {
    default: '',
    required: true,
    type: String,
  },

  size: {
    type: [String, Number],
    default: '20x20'
  },
},
```

## Usage

```jsx
<Icon typ="add" size={20} />

// same as [width] x [height]
<Icon typ="add" size="20x20" />
```

## Colorful
The Icon component export as a standard svg tag, you can `fill` the color free.

```js
import { Icon } from 'owl-ui'

<Icon fill="#e08600" typ="alarm" size={45} />
```

## Demo
