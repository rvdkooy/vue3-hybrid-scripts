class HybridScriptsContext {
  private scripts: Set<string>;
  constructor () {
    this.scripts = new Set();
  }
  public addScript (script: string) {
    this.scripts.add(script);
  }

  public renderSsrContext() {
    const baseScript = `<script>function onHybridScriptLoaded(el) { el.setAttribute('data-hybrid-script-loaded', 'true');window.dispatchEvent(new CustomEvent('hybrid-script-loaded'));}</script>`
    return `${[
      baseScript,
      ...this.scripts].map(s => s.replace(/(?:\r\n|\r|\n)/g, '')).join('\r\n')}`
    ;
  }
}

export default HybridScriptsContext;
