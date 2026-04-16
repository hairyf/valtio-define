/* eslint-disable ts/no-namespace */
export { Fragment, jsx, jsxDEV, jsxs } from 'valtio-signal/jsx-runtime'

declare global {
  namespace JSX {
    // 继承 React 定义的所有内置元素
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
    // 定义 JSX 转换后的返回类型（与你的 jsx 函数返回值一致）
    interface Element extends React.ReactElement<any, any> {}
  }
}
