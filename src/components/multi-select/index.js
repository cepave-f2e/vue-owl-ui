import delegate from 'delegate-to'
import s from './multi-select.scss'
import Label from '../label'
import Loading from '../loading'

const MultiSelect = {
  props: {
    options: {
      type: Array,
      required: true
    },

    selectedIdx: {
      type: Array,
      required: true
    },

    displayKey: {
      type: String,
      required: true
    },

    isOpened: {
      type: Boolean,
      default: false,
    },

    isDisabled: {
      type: Boolean,
      default: false
    },

    caseInsensitive: {
      type: Boolean,
      default: false
    },

    // apiMode: {
    //   type: Boolean,
    //   default: false
    // },

    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      labels: [], //displayed options
      opened: this.isOpened,
      disable: this.isDisabled,
      loadingPie: this.loading,
      displayIdx: [],
      optionsHovered: false,
      labelRemoved: false,
      inputWidth: 1,
      focusedIdx: -1,
    }
  },

  mounted() {
    this.displayIdx = [...Array(this.options.length)].map((v, i) => {
      return i
    })
    this.labels = this.options.reduce((preVal, curVal, idx) => {
      const isSelected = this.selectedIdx.indexOf(idx)
      if (isSelected >= 0) {
        preVal.push(this.options[idx])
      }
      return preVal
    }, [])
  },

  watch: {
    selectedIdx(newVal) {
      this.labels = this.options.reduce((preVal, curVal, idx) => {
        const isSelected = newVal.indexOf(idx)
        if (isSelected >= 0) {
          preVal.push(this.options[idx])
        }
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
    }
  },

  computed: {
    renderOptions() {
      const { options, displayIdx, selectedIdx, displayKey } = this
      const h = this.$createElement

      const _options = options.reduce((preVal, newVal, idx) => {
        const style = [s.option]
        const toDisplay = displayIdx.indexOf(idx)
        const isSelected = selectedIdx.indexOf(idx)
        if (isSelected >= 0) {
          style.push(s.selected)
        }
        if (toDisplay >= 0) {
          preVal.push(
            <div tabIndex="0" data-role="select-option" data-idx={idx} class={style}>
              {newVal[displayKey]}
            </div>
          )
        }
        return preVal
      }, [])

      return _options
    },

    renderLoading() {
      const { style } = this
      const h = this.$createElement
      const _loadingOption = <div class={[s.loadingOption]}><Loading typ="pie" size={10} class={[s.loading]} />loading...</div>
      return _loadingOption
    },

    css() {
      const { opened, disable } = this
      const style = {}
      style[s.selectOpen] = opened
      style[s.disabled] = disable
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
    },

    handleMouseEnter(e) {
      // handle focus -> true losefocus -> false
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
      if (this.labelRemoved) { //if toggleMenu is triggered by removing label
        this.labelRemoved = false
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
        if (newVal[displayKey].toLowerCase().includes(this.$refs.searchField.value.toLowerCase())) {
          preVal.push(idx)
        }
        return preVal
      }, [])
      : this.options.reduce((preVal, newVal, idx) => {
        if (newVal[displayKey].includes(this.$refs.searchField.value)) {
          preVal.push(idx)
        }
        return preVal
      }, [])

      this.displayIdx = searchResult
      this.inputWidth = (this.$refs.searchField.value.length) ? (this.$refs.searchField.value.length) : 1
      this.opened = true
    },

    handleInputKeyDown(e) {
      if (e.keyCode !== 38 && e.keyCode !== 40) {
        return
      }
      this.optionsHovered = true
      this.$refs.searchField.blur()
      this.focusAdjacentOption(-1, 'next')
    },

    _handleOnChange: delegate('[data-role="select-option"]', function(ev) {
      const { delegateTarget } = ev
      delegateTarget.focus()
      const { selectedIdx } = this
      const changedId = delegateTarget.getAttribute('data-idx')
      const idx = selectedIdx.indexOf(+changedId)
      if (idx >= 0) { //unselect
        this.selectedIdx.splice(idx, 1)
        this.outputResult()
      } else { //select
        this.selectedIdx.push(+changedId)
        this.outputResult()
      }
      this.selectedIdx = this.selectedIdx.sort()
    }),

    _handleMouseOver: delegate('[data-role="select-option"]', function(ev) {
      const { delegateTarget } = ev
      if (ev.type === 'mouseover') {
        this.optionsHovered = true
      }
      delegateTarget.focus()
    }),

    handleLabelRemove(data) { //unselect
      const idxToRemove = this.options.indexOf(data)
      const idx = this.selectedIdx.indexOf(idxToRemove)
      this.selectedIdx.splice(idx, 1)
      this.labelRemoved = true
      this.outputResult()
    },

    _handleKeyEvent: delegate('[data-role="select-option"]', function(ev) {
      const { delegateTarget } = ev
      const currentId = delegateTarget.getAttribute('data-idx')
      if (ev.keyCode === 38) {//arrowUp
        this.focusAdjacentOption(+currentId, 'pre')
      } else if (ev.keyCode === 40) { //arrowDown
        this.focusAdjacentOption(+currentId, 'next')
      } else if (ev.keyCode === 13) {
        const { delegateTarget } = ev
        const { selectedIdx } = this
        const changedId = delegateTarget.getAttribute('data-idx')
        const idx = selectedIdx.indexOf(+changedId)
        if (idx >= 0) { //unselect
          this.selectedIdx.splice(idx, 1)
          this.outputResult()
        } else { //select
          this.selectedIdx.push(+changedId)
          this.outputResult()
        }
        this.selectedIdx = this.selectedIdx.sort()
      }
      ev.preventDefault()
    }),

    focusAdjacentOption(curDataIdx, dir) {
      let targetDataIdx
      const { displayIdx } = this
      const idxOfCurDataIdx = this.displayIdx.indexOf(curDataIdx)
      const displayArrLength = this.displayIdx.length

      if (curDataIdx === -1) { //current not focus on optionBox
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
      currentTarget.blur()
      focusTarget.focus()
      this.focusedIdx = targetDataIdx
    },

  },


  render(h) {
    const { css, close, toggleMenu, renderOptions, _handleMouseOver, handleMouseEnter, 
            _handleOnChange, _handleKeyEvent, handleLabelRemove, handleInputKeyDown,
            labels, inputWidth, disable } = this
    return (
      <div class={[s.selecter, css]}>
        <div class={[s.searchField]} onClick={toggleMenu}>
          <Label.Group x badge 
                       displayKey="value"
                       typ="outline" 
                       options={labels} 
                       onRemove={handleLabelRemove} 
                       class={(disable) ? [s.disabledLabelg] : [s.labelg]} />
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
              on-keydown={_handleKeyEvent}
              on-mouseenter={handleMouseEnter}
              on-mouseleave={handleMouseEnter}
              on-mouseover={_handleMouseOver}
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
  }
}

module.exports = MultiSelect
