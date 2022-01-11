declare global {
  interface Window {
    onHybridScriptLoaded: (el: HTMLElement) => void;
  }
}

export const addLinkToPage = (href:string): Promise<void> => {
  return new Promise((resolve) => {
    const link = document.createElement('link') as HTMLLinkElement
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    link.onload = () => {
      window.onHybridScriptLoaded(link);
      resolve()
    }
    link.onerror = (e) => console.log(e);
    document.body.appendChild(link)
  })
};

export const addScriptToPage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const script = document.createElement('script') as HTMLScriptElement
    script.setAttribute('src', src)
    script.onload = () => {
      console.log('onload');
      window.onHybridScriptLoaded(script);
      resolve()
    }
    script.onerror = (e) => console.log(e);
    document.body.appendChild(script)
  })
}

export const allScriptLoaded = (scripts: string[]) => {
  let allLoaded = false;
  scripts.filter(s => s.indexOf('.js') !== -1).forEach((s) => {
    const script = document.querySelector(`script[src="${s}"]`) as HTMLScriptElement;
    allLoaded = script.getAttribute('data-hybrid-script-loaded') === 'true';
  });

  scripts.filter(s => s.indexOf('.css') !== -1).forEach((s) => {
    const script = document.querySelector(`link[href="${s}"]`) as HTMLScriptElement;
    allLoaded = script.getAttribute('data-hybrid-script-loaded') === 'true';
  });

  return allLoaded;
};

const concat = list => Array.prototype.concat.bind(list)
const promiseConcat = f => x => f().then(concat(x))
const promiseReduce = (acc, x) => acc.then(promiseConcat(x))
export const runPromisesSequantially = (funcs: Array<() => Promise<void>>) => funcs.reduce(promiseReduce, Promise.resolve([]))
