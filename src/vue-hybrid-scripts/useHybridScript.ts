import { useSSRContext } from 'vue';
import { HybridScriptsContext } from './main';
import { addLinkToPage, addScriptToPage, allScriptLoaded, runPromisesSequantially } from './utils';

export interface Script {
  src: string;
  async?: boolean
  defer?: boolean
}

export interface Link {
  href: string;
}

export type tagArgs = Array<string | Script | Link> | string | Script | Link;

export const useHybridScripts = (tag: tagArgs, cb?: () => void) => {
  let makeArray: Array<string | Script | Link>;
  if (Array.isArray(tag)) {
    makeArray = tag;
  } else {
    makeArray = [tag]
  }
  const tags: Array<Script | Link> = makeArray.map((a) => {
    if (typeof a === 'string') {
      return (a.indexOf('.js') !== -1) ? { src: a } : { href: a };
    } else {
      return a;
    }
  });
  
  const ssr = typeof window === 'undefined'

  if (ssr) {
    const ssrContext: { hybridScripts?: HybridScriptsContext } = useSSRContext()
    ssrContext.hybridScripts = ssrContext.hybridScripts || new HybridScriptsContext();
    tags
      .filter(s => (s as Link).href)
      .forEach(s => {
      ssrContext.hybridScripts.addLink(s as Link);
    });

    tags
      .filter(s => (s as Script).src)
      .forEach(s => {
      ssrContext.hybridScripts.addScript(s as Script);
    });

  } else {
    const listenToHybridScriptLoaded = () => {
      if (allScriptLoaded(tags)) {
        window.removeEventListener('hybrid-script-loaded', listenToHybridScriptLoaded);
        cb();
      }
    }

    if (!window.onHybridScriptLoaded) {
      window.onHybridScriptLoaded = function onHybridScriptLoaded(el) {
        el.setAttribute('data-hybrid-script-loaded', 'true');
        window.dispatchEvent(new CustomEvent('hybrid-script-loaded'));
      }
    }
    const scriptsThatAreNotOnThePage = tags
      .filter(s => (s as Script).src)
      .filter(s => !document.querySelector(`script[data-hybrid-script-id="${(s as Script).src}"]`));
    const linksThatAreNotOnThePage = tags
      .filter(s => (s as Link).href)
      .filter(s => !document.querySelector(`link[data-hybrid-script-id="${(s as Link).href}"]`))
    const addTagsFuncs = [
      ...linksThatAreNotOnThePage.map(s => () => addLinkToPage(s as Link)),
      ...scriptsThatAreNotOnThePage.map(s => () => addScriptToPage(s as Script)),
    ]

    runPromisesSequantially(addTagsFuncs).then(() => {
      if (allScriptLoaded(tags)) {
        cb();
      } else {
        window.addEventListener('hybrid-script-loaded', listenToHybridScriptLoaded);
      }
    });

    return () => {
      window.removeEventListener('hybrid-script-loaded', listenToHybridScriptLoaded);
    }
  }
};
