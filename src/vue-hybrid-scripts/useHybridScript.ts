import { onMounted, onUnmounted, useSSRContext } from 'vue';
import HybridScriptsContext from './hybridScriptsContext';
import { addLinkToPage, addScriptToPage, allScriptLoaded, runPromisesSequantially } from './utils';

export const useHybridScripts = async (tag: string[] | string, cb?: () => void) => {
  const tags = (typeof tag === 'string') ? [tag] : tag;
  const ssr = typeof window === 'undefined'

  if (ssr) {
    const ssrContext: { hybridScripts?: HybridScriptsContext } = useSSRContext()
    ssrContext.hybridScripts = ssrContext.hybridScripts || new HybridScriptsContext();
    tags
      .filter(s => s.indexOf('.css') !== -1)
      .forEach(s => {
      ssrContext.hybridScripts.addScript(`<link href=${s} rel="stylesheet" onload="onHybridScriptLoaded(this)"></link>`);
    });

    tags
      .filter(s => s.indexOf('.js') !== -1)
      .forEach(s => {
      ssrContext.hybridScripts.addScript(`<script src=${s} onload="onHybridScriptLoaded(this)"></script>`);
    });

  } else {
    const listenToHybridScriptLoaded = () => {
      if (allScriptLoaded(tags)) {
        cb();
        window.removeEventListener('hybrid-script-loaded', listenToHybridScriptLoaded);
      }
    }

    onMounted(async () => {
      if (!window.onHybridScriptLoaded) {
        window.onHybridScriptLoaded = function onHybridScriptLoaded(el) {
          el.setAttribute('data-hybrid-script-loaded', 'true');
          window.dispatchEvent(new CustomEvent('hybrid-script-loaded'));
        }
      }
      const scriptsThatAreNotOnThePage = tags
        .filter(s => s.indexOf('.js') !== -1)
        .filter(s => !document.querySelector(`script[src="${s}"]`));
      const linksThatAreNotOnThePage = tags
        .filter(s => s.indexOf('.css') !== -1)
        .filter(s => !document.querySelector(`link[href="${s}"]`))
      const addTagsFuncs = [
        ...linksThatAreNotOnThePage.map(s => () => addLinkToPage(s)),
        ...scriptsThatAreNotOnThePage.map(s => () => addScriptToPage(s)),
      ]
      await runPromisesSequantially(addTagsFuncs);

      if (allScriptLoaded(tags)) {
        cb();
      } else {
        window.addEventListener('hybrid-script-loaded', listenToHybridScriptLoaded);
      }
    });

    onUnmounted(() => {
      window.removeEventListener('hybrid-script-loaded', listenToHybridScriptLoaded);
    });
  }
};
