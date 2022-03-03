/**
 * @jest-environment jsdom
 */
import { useHybridScripts } from './main';
import * as utils from './utils';

jest.mock('vue', () => {
  return {
    useSSRContext: () => {
      return null;
    },
  }
});

const addLoadedScriptToPage = (url: string) => {
  const script = document.createElement('script');
  script.src = url;
  script.setAttribute('data-hybrid-script-id', url);
  script.setAttribute('data-hybrid-script-loaded', 'true');
  document.head.appendChild(script);
};

const addLoadedLinkToPage = (url: string) => {
  const link = document.createElement('link');
  link.href = url;
  link.setAttribute('data-hybrid-script-id', url);
  link.setAttribute('data-hybrid-script-loaded', 'true');
  document.head.appendChild(link);
};

describe('useHybridScripts browser specs', () => {
  beforeEach(() => {
    jest.spyOn(utils, 'addScriptToPage').mockImplementation((script) => {
      addLoadedScriptToPage(script.src);
      return Promise.resolve();
    });
    jest.spyOn(utils, 'addLinkToPage').mockImplementation((link) => {
      addLoadedLinkToPage(link.href);
      return Promise.resolve();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    const scripts = document.querySelectorAll('script');
    scripts.forEach(s => s.remove());
    const links = document.querySelectorAll('link');
    links.forEach(l => l.remove());
  });

  it('it should add javascripts to the page when not yet available and resolve', (done) => {
    useHybridScripts('http://localhost:8080/static/test.js', () => {
      expect(utils.addScriptToPage).toHaveBeenCalled();
      expect(document.querySelector('script[data-hybrid-script-id="http://localhost:8080/static/test.js"]')).not.toBe(null);
      done();
    });
  });

  it('it should NOT add javascripts to the page when already available and resolve', (done) => {
    addLoadedScriptToPage('http://localhost:8080/static/test.js');

    useHybridScripts('http://localhost:8080/static/test.js', () => {
      expect(utils.addScriptToPage).not.toHaveBeenCalled();
      expect(document.querySelector('script[data-hybrid-script-id="http://localhost:8080/static/test.js"]')).not.toBe(null);;
      done();
    });
  });

  it('it should add links to the page when not yet available and resolve', (done) => {
    useHybridScripts('http://localhost:8080/static/test.css', () => {
      expect(utils.addLinkToPage).toHaveBeenCalled();
      expect(document.querySelector('link[data-hybrid-script-id="http://localhost:8080/static/test.css"]')).not.toBe(null);;
      done();
    });
  });

  it('it should NOT add links to the page when already available and resolve', (done) => {
    addLoadedLinkToPage('http://localhost:8080/static/test.css');

    useHybridScripts('http://localhost:8080/static/test.css', () => {
      expect(utils.addLinkToPage).not.toHaveBeenCalled();
      expect(document.querySelector('link[data-hybrid-script-id="http://localhost:8080/static/test.css"]')).not.toBe(null);;
      done();
    });
  });

  it('it should support multiple scripts and links', (done) => {
    useHybridScripts([
      'http://localhost:8080/static/test.js',
      'http://localhost:8080/static/test.css',
    ], () => {
      expect(utils.addScriptToPage).toHaveBeenCalled();
      expect(utils.addLinkToPage).toHaveBeenCalled();
      done();
    });
  });

  it('it should support script and link objects as arguments', (done) => {
    useHybridScripts([
      { src: 'http://localhost:8080/static/test.js', async: true, defer: true },
      { href: 'http://localhost:8080/static/test.css' },
    ], () => {
      expect(utils.addScriptToPage).toHaveBeenCalled();
      expect(utils.addLinkToPage).toHaveBeenCalled();
      done();
    });
  });
});
