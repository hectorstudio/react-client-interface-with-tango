import { createElement, createRef, PureComponent } from 'react';
import scrollIntoViewIfNeeded from 'scroll-into-view';

/*
This code is based on src/index.js from https://www.npmjs.com/package/react-scroll-into-view-if-needed
*/
export default class ScrollIntoViewIfNeeded extends PureComponent {

  static defaultProps = {
    active: true,
    elementType: 'div',
    options: {
      behavior: 'smooth',
      scrollMode: 'if-needed',
    },
  };

  constructor() {
    super();
    this.node = createRef();
  }

  componentDidMount() {
    if (this.props.active && this.props.isSelected){
      this.handleScrollIntoViewIfNeeded();
    } 
  }

  componentDidUpdate({ active }) {
    const { active: isNowActive } = this.props;
    if (!active && isNowActive && this.props.isSelected) {
      this.handleScrollIntoViewIfNeeded();
    }
  }

  handleScrollIntoViewIfNeeded = () => {
    scrollIntoViewIfNeeded(this.node.current, this.props.options);
  };

  render() {
    const {
      active,
      elementType,
      children,
      options,
      ...wrapperProps
    } = this.props;
    return createElement(elementType, { ref: this.node, ...wrapperProps }, children);
  }
}