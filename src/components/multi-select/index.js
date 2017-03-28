import delegate from 'delegate-to'
import s from './multi-select.scss'
import Label from '../label'
import Loading from '../loading'

const MultiSelect = {
  props: {
    options: {
      type: Array,
      required: true,
    },

    selectedOpts: {
      type: Array,
      required: true,
    },

    displayKey: {
      type: String,
      required: true,
    },

    isOpened: {
      type: Boolean,
      default: false,
    },

    isDisabled: {
      type: Boolean,
      default: false,
    },

    caseInsensitive: {
      type: Boolean,
      default: false,
    },

    // apiMode: {
    //   type: Boolean,
    //   default: false
    // },

    loading: {
      type: Boolean,
      default: false,
    },

    loadingMsg: {
      type: String,
      default: 'loading...',
    },
  },

  data() {
    return {
      labels: [],
      opened: this.isOpened,
      disable: this.isDisabled,
      loadingPie: this.loading,
      displayIdx: [],
      optionsHovered: false,
      disablePointer: false,
      inputWidth: 1,
      focusedIdx: -1,
      focusedLabelIdx: -1,
      selectedIdx: this.selectedOpts,
    }
  },

  mounted() {
    if (this.options.length) {
      this.displayIdx = [...Array(this.options.length).keys()]
      this.labels = this.selectedIdx.reduce((preVal, curVal, idx) => {
        preVal.push(this.options[curVal])
        return preVal        
      }, [])
    }
  },

  watch: {
    selectedOpts(newVal) {
      this.selectedIdx = newVal
    },
    options(newVal) {
      this.displayIdx = [...Array(newVal.length).keys()]
      this.labels = this.selectedIdx.reduce((preVal, curVal, idx) => {
        preVal.push(newVal[curVal])
        return preVal        
      }, [])
    },
    selectedIdx(newVal) {
      this.labels = newVal.reduce((preVal, curVal, idx) => {
        preVal.push(this.options[curVal])
        return preVal        
      }, [])
    },
    isOpened(newVal) {
      this.opened = newVal
    },
    isDisabled(newVal) {
      this.disable = newVal
    },
    loading(newVal) {
      this.loadingPie = newVal
    },
  },

  computed: {
    renderOptions() {
      const { options, displayIdx, selectedIdx, displayKey, disablePointer } = this
      const h = this.$createElement

      const _options = options.reduce((preVal, newVal, idx) => {
        const toDisplay = displayIdx.indexOf(idx)
        const isSelected = selectedIdx.indexOf(idx)

        const classes = {
          [s.option]: true,
          [s.selected]: (isSelected >= 0),
          [s.focused]: (idx === this.focusedIdx),
          [s.disablePointer]: disablePointer,
        }

        if (toDisplay >= 0) {
          preVal.push(
            <div tabIndex="0" data-role="select-option" data-idx={idx} class={classes}>
              {newVal[displayKey]}
            </div>
          )
        }
        return preVal
      }, [])

      return _options
    },

    renderLoading() {
      const { style, loadingMsg } = this
      const h = this.$createElement
      const _loadingOption = <div class={[s.loadingOption]}><Loading typ="pie" size={10} class={[s.loading]} />{loadingMsg}</div>
      return _loadingOption
    },

    css() {
      const { opened, disable } = this
      const style = {
        [s.selectOpen]: opened,
        [s.disabled]: disable,
      }
      return style
    },

  },

  methods: {
    outputResult() {
      const result = this.selectedIdx.reduce((preVal, curVal, idx) => {
        preVal.push(this.options[curVal])
        return preVal
      }, [])
      this.$emit('change', result)
    },

    close() {
      const { optionsHovered } = this
      this.opened = (this.optionsHovered) ? true : false
      this.focusedIdx = -1
      this.focusedLabelIdx = -1
    },

    handleMouseEnter(e) {
      if (e.type === 'mouseenter') {
        this.optionsHovered = true
      } else if (e.type === 'mouseleave') {
        this.optionsHovered = false
      }
    },

    toggleMenu(ev) {
      ev.stopPropagation()
      if (this.disable) {
        return
      }

      this.opened = !this.opened

      if (this.opened) {
        this.$refs.searchField.focus()
      }
    },

    handleInput(e) {
      const { displayKey, caseInsensitive } = this

      // if (this.apiMode) {
      //   this.$emit('inputChange', this.$refs.searchField.value)
      // }

      const searchResult = (caseInsensitive)
      ? this.options.reduce((preVal, newVal, idx) => {
        if (newVal[displayKey].toLowerCase().includes(this.$refs.searchField.value.trim().toLowerCase())) {
          preVal.push(idx)
        }
        return preVal
      }, [])
      : this.options.reduce((preVal, newVal, idx) => {
        if (newVal[displayKey].includes(this.$refs.searchField.value.trim())) {
          preVal.push(idx)
        }
        return preVal
      }, [])

      this.displayIdx = searchResult
      this.inputWidth = (this.$refs.searchField.value.length) ? (this.$refs.searchField.value.length) : 1
      this.opened = true
    },

    handleInputKeyDown(e) {
      this.optionsHovered = true
      this.disablePointer = true

      if (e.keyCode === 38) {// arrowUp
        this.focusAdjacentOption(this.focusedIdx, 'pre')
      } else if (e.keyCode === 40) { // arrowDown
        this.focusAdjacentOption(this.focusedIdx, 'next')
      } else if (e.keyCode === 13) { // ENTER
        const { selectedIdx } = this
        const idx = selectedIdx.indexOf(this.focusedIdx)
        if (idx >= 0) { // unselect
          this.selectedIdx.splice(idx, 1)
          this.outputResult()
        } else { // select
          this.selectedIdx.push(this.focusedIdx)
          this.outputResult()
        }
      } else if (e.keyCode === 8 && this.$refs.searchField.value.length <= 0) { // backspace delete
        const selectedArrLen = this.selectedIdx.length

        if (this.focusedLabelIdx === -1) { // empty input and focus on last label
          this.focusedLabelIdx = selectedArrLen - 1
        } else if (this.focusedLabelIdx > -1) {// delete the focused label
          this.selectedIdx.pop()
          this.focusedLabelIdx = -1
        }
      }
    },

    _handleOnChange: delegate('[data-role="select-option"]', function(ev) {
      const { delegateTarget } = ev
      delegateTarget.focus()
      const { selectedIdx } = this
      const changedId = delegateTarget.getAttribute('data-idx')
      const idx = selectedIdx.indexOf(+changedId)
      if (idx >= 0) { // unselect
        this.selectedIdx.splice(idx, 1)
        this.outputResult()
      } else { // select
        this.selectedIdx.push(+changedId)
        this.outputResult()
      }

      this.$refs.searchField.focus()
    }),

    _handleMouseOver: delegate('[data-role="select-option"]', function(ev) {
      const { delegateTarget } = ev
      const hoveredId = delegateTarget.getAttribute('data-idx')
      if (ev.type === 'mouseover') {
        this.optionsHovered = true
      }

      this.focusedIdx = +hoveredId
    }),

    handleMouseMove(ev) {
      this.disablePointer = false
    },

    handleLabelRemove(data) { // unselect
      const idxToRemove = this.options.indexOf(data)
      const idx = this.selectedIdx.indexOf(idxToRemove)
      this.selectedIdx.splice(idx, 1)
      this.outputResult()
      this.$refs.searchField.focus()
    },

    focusAdjacentOption(curDataIdx, dir) {
      let targetDataIdx
      const { displayIdx } = this
      const idxOfCurDataIdx = this.displayIdx.indexOf(curDataIdx)
      const displayArrLength = this.displayIdx.length

      if (curDataIdx === -1) { // current not focus on optionBox
        curDataIdx = displayIdx[0]
        targetDataIdx = displayIdx[0]
      } else {
        switch (dir) {
        case 'next':
          targetDataIdx = ((idxOfCurDataIdx + 1) >= displayArrLength) ? displayIdx[(idxOfCurDataIdx + 1) % displayArrLength] : displayIdx[idxOfCurDataIdx + 1]
          break
        case 'pre':
          targetDataIdx = ((idxOfCurDataIdx - 1) < 0) ? displayIdx[displayArrLength + idxOfCurDataIdx - 1] : displayIdx[idxOfCurDataIdx - 1]
          break
        }
      }

      const currentTarget = this.$el.querySelector(`[data-role="select-option"][data-idx="${curDataIdx}"]`)
      const focusTarget = this.$el.querySelector(`[data-role="select-option"][data-idx="${targetDataIdx}"]`)
      
      focusTarget.focus()
      this.$refs.searchField.focus()

      this.focusedIdx = targetDataIdx
      this.optionsHovered = false
    },

  },


  render(h) {
    const { css, close, toggleMenu, renderOptions, _handleMouseOver, handleMouseEnter, handleMouseMove,
            _handleOnChange, handleLabelRemove, handleInputKeyDown,
            labels, inputWidth, disable, displayKey } = this
    return (
      <div class={[s.selecter, css]}>
        <div class={[s.searchField]} onClick={toggleMenu}>
          <Label.Group x badge 
                       displayKey={displayKey}
                       typ="outline" 
                       options={labels} 
                       onRemove={handleLabelRemove} 
                       class={(disable) ? [s.disabledLabelg] : [s.labelg]} 
                       focused={this.focusedLabelIdx}
          />
          <input class={[s.invisibleInput]}
                 size={inputWidth}
                 ref="searchField"
                 onInput={this.handleInput}
                 onBlur={close}
                 on-keydown={this.handleInputKeyDown}
                 disabled={disable}
          >
          </input>
        </div>
        <div  class={[s.optionBox]}
              onClick={_handleOnChange}
              on-mouseenter={handleMouseEnter}
              on-mouseleave={handleMouseEnter}
              on-mouseover={_handleMouseOver}
              on-mousemove={handleMouseMove}
        >
          {
            (this.loadingPie) 
            ? this.renderLoading 
            : ''
          }
          {renderOptions}
        </div>
      </div>
    )
  },
}

module.exports = MultiSelect
