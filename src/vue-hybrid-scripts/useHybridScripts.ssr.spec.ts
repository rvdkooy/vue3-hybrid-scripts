/**
 * @jest-environment node
 */
import HybridScriptsContext from './hybridScriptsContext';
import useHybridScripts from './useHybridScript';

let ssrContext: { hybridScripts?: HybridScriptsContext } = { };

jest.mock('vue', () => {
  return {
    onMounted: () => {},
    useSSRContext: () => {
      return ssrContext;
    },
  }
});

describe('useHybridScripts ssr specs', () => {
  beforeEach(() => {
    ssrContext = {};
  });

  it('it should add scripts and links to the ssr context', () => {
    useHybridScripts('https://code.jquery.com/jquery-3.6.0.min.js');

    const renderedSrrContext = ssrContext.hybridScripts.renderSsrContext();
    expect(renderedSrrContext).toContain(`<script>function onHybridScriptLoaded(el) { el.setAttribute('data-hybrid-script-loaded', 'true');window.dispatchEvent(new CustomEvent('hybrid-script-loaded'));}</script>`);
    expect(renderedSrrContext).toContain(`<script src=https://code.jquery.com/jquery-3.6.0.min.js onload=\"onHybridScriptLoaded(this)\"></script>`);
  });

  it('it should add css links to to ssr context', () => {
    useHybridScripts('https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css');

    const renderedSrrContext = ssrContext.hybridScripts.renderSsrContext();
    expect(renderedSrrContext).toContain(`<script>function onHybridScriptLoaded(el) { el.setAttribute('data-hybrid-script-loaded', 'true');window.dispatchEvent(new CustomEvent('hybrid-script-loaded'));}</script>`);
    expect(renderedSrrContext).toContain(`<link href=https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css rel=\"stylesheet\" onload=\"onHybridScriptLoaded(this)\"></link>`);
  });
});
