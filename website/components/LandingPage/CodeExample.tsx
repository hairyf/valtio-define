import Highlight, { defaultProps } from 'prism-react-renderer'
import { useSnapshot } from 'valtio'
import { GettingStarted } from './GettingStarted'
import { decDuration, incDuration, state } from './state'

function exampleCode(dur: number, count: number) {
  return `
  const store = defineStore({
    state: () => ({
      dur: ${dur},
      count: ${count}
    }),
    actions: {
      incDur() {
        ++this.dur
      },
      decDur() {
      --state.dur
      },
      incCount() {
        ++state.count;
        setTimeout(incCount, 100 * state.dur);
      }
    }
  });

  store.incCount();

  const { dur, decDur, incDur } = useStore(store)

  return (
    <div>
      <h3>{dur}</h3>
      <button
        disabled={dur <= 1}
        onClick={decDur}>
        -
      </button>
      <button
        disabled={dur >= 10}
        onClick={incDur}>
        +
      </button>
    </div>
  );
`
}

export function CodeExample() {
  const snap = useSnapshot(state)
  return (
    <div className="code-container">
      <div className="code-container-inner">
        <div className="duration-changer">
          <h3 className="text-xl font-bold">{snap.dur}</h3>
          <div className="button-container">
            <button
              className="counter"
              disabled={snap.dur <= 1}
              onClick={decDuration}
            >
              -
            </button>
            <button
              className="counter"
              disabled={snap.dur >= 10}
              onClick={incDuration}
            >
              +
            </button>
          </div>
        </div>
        <Highlight
          {...defaultProps}
          code={exampleCode(snap.dur, snap.count)}
          language="jsx"
          theme={undefined}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} pre`} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
        <GettingStarted className="small-screen" />
      </div>
    </div>
  )
}
