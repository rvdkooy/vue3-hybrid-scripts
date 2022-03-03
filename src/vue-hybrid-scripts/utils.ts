import { Link, Script } from "./useHybridScript";

declare global {
  interface Window {
    onHybridScriptLoaded: (el: HTMLElement) => void;
  }
}

export const addLinkToPage = (l: Link): Promise<void> => {
  return new Promise((resolve) => {
    const link = document.createElement('link') as HTMLLinkElement
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', l.href);
    link.setAttribute('data-hybrid-script-id', l.href);
    link.onload = () => {
      window.onHybridScriptLoaded(link);
      resolve()
    }
    link.onerror = (e) => console.log(e);
    document.body.appendChild(link)
  })
};

export const addScriptToPage = (s: Script): Promise<void> => {
  return new Promise((resolve) => {
    const script = document.createElement('script') as HTMLScriptElement
    script.setAttribute('src', s.src);
    script.setAttribute('data-hybrid-script-id', s.src);
    script.onload = () => {
      console.log('onload');
      window.onHybridScriptLoaded(script);
      resolve()
    }
    script.onerror = (e) => console.log(e);
    document.body.appendChild(script)
  })
}

export const allScriptLoaded = (scripts: Array<Link | Script>) => {
  let allLoaded = false;
  scripts.filter(s => (s as Script).src).forEach((s) => {
    const script = document.querySelector(`script[data-hybrid-script-id="${(s as Script).src}"]`) as HTMLScriptElement;
    allLoaded = script.getAttribute('data-hybrid-script-loaded') === 'true';
  });

  scripts.filter(s => (s as Link).href).forEach((s) => {
    const script = document.querySelector(`link[data-hybrid-script-id="${(s as Link).href}"]`) as HTMLScriptElement;
    allLoaded = script.getAttribute('data-hybrid-script-loaded') === 'true';
  });

  return allLoaded;
};

const concat = list => Array.prototype.concat.bind(list)
const promiseConcat = f => x => f().then(concat(x))
const promiseReduce = (acc, x) => acc.then(promiseConcat(x))
export const runPromisesSequantially = (funcs: Array<() => Promise<void>>) => funcs.reduce(promiseReduce, Promise.resolve([]))
