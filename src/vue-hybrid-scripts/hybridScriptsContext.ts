import { Link, Script } from "./useHybridScript";

class HybridScriptsContext {
  private scripts: Set<Script>;
  private links: Set<Link>
  constructor () {
    this.scripts = new Set();
    this.links = new Set();
  }
  public addScript (script: Script) {
    this.scripts.add(script);
  }
  public addLink (link: Link) {
    this.links.add(link);
  }

  public render() {
    const scriptsString = Array.from(this.scripts).map(s => {
      let result = `<script src="${s.src}" data-hybrid-script-id="${s.src}"`;
      result += s.async ? ' async' : '';
      result += s.defer ? ' defer': '';
      result += ` onload="onHybridScriptLoaded(this)"></script>`;
      return result;
    })
    const linksString = Array.from(this.links).map(s => `<link href="${s.href}" data-hybrid-script-id="${s.href}" rel="stylesheet" onload="onHybridScriptLoaded(this)">`)
    
    const baseScript = `<script>function onHybridScriptLoaded(el) { el.setAttribute('data-hybrid-script-loaded', 'true');window.dispatchEvent(new CustomEvent('hybrid-script-loaded'));}</script>`
    return `${[
      baseScript,
      ...linksString,
      ...scriptsString,
    ].map(s => s.replace(/(?:\r\n|\r|\n)/g, '')).join('\r\n')}`
    ;
  }
}

export default HybridScriptsContext;
