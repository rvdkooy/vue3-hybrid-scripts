/**
 * @jest-environment node
 */
import HybridScriptsContext from './hybridScriptsContext';
import { useHybridScripts } from './main';

let ssrContext: { hybridScripts?: HybridScriptsContext } = { };

jest.mock('vue', () => {
  return {
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

    const renderedSrrContext = ssrContext.hybridScripts.render();
    expect(renderedSrrContext).toContain(`<script>function onHybridScriptLoaded(el) { el.setAttribute('data-hybrid-script-loaded', 'true');window.dispatchEvent(new CustomEvent('hybrid-script-loaded'));}</script>`);
    expect(renderedSrrContext).toContain(`<script src=\"https://code.jquery.com/jquery-3.6.0.min.js\" onload=\"onHybridScriptLoaded(this)\"></script>`);
  });

  it('it should add css links to to ssr context', () => {
    useHybridScripts('https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css');

    const renderedSrrContext = ssrContext.hybridScripts.render();
    expect(renderedSrrContext).toContain(`<script>function onHybridScriptLoaded(el) { el.setAttribute('data-hybrid-script-loaded', 'true');window.dispatchEvent(new CustomEvent('hybrid-script-loaded'));}</script>`);
    expect(renderedSrrContext).toContain(`<link href=\"https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css\" rel=\"stylesheet\" onload=\"onHybridScriptLoaded(this)\"></link>`);
  });

  it('it should support script and link objects as arguments', () => {
    useHybridScripts([
      { src: 'http://localhost:8080/static/test.js', async: true, defer: true },
      { href: 'http://localhost:8080/static/test.css' },
    ]);

    const renderedSrrContext = ssrContext.hybridScripts.render();
    expect(renderedSrrContext).toContain(`<link href=\"http://localhost:8080/static/test.css\" rel=\"stylesheet\" onload=\"onHybridScriptLoaded(this)\"></link>`);
    expect(renderedSrrContext).toContain(`<script src=\"http://localhost:8080/static/test.js\" async defer onload=\"onHybridScriptLoaded(this)\"></script>`);
  });
});
