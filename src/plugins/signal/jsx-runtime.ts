/* eslint-disable ts/no-namespace */
export { Fragment, jsx, jsxDEV, jsxs } from 'valtio-signal/jsx-runtime'

declare global {
  namespace JSX {
    // Inherit all built-in elements defined by React
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
    // Define the return type after JSX conversion
    interface Element extends React.ReactElement<any, any> {}
  }
}
