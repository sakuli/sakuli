import { stripIndent } from "common-tags";

export const INJECT_SAKULI_HOOK = stripIndent`
if (!("sakuliHookEnabled" in window) || !window.sakuliHookEnabled) {
    window.openRequests = 0;
    window.sakuliHookEnabled = true;
    
    const increaseOpenRequests = () => {
        ++window.openRequests;
    }
    
    const decreaseOpenRequests = () => {
        --window.openRequests;
        window.openRequests = (window.openRequests >= 0) ? window.openRequests : 0;
    }

    const oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
      increaseOpenRequests();
      console.log("Open requests before XHR: " + window.openRequests);
      this.addEventListener('load', () => {
        while (this.readyState > 1 && this.readyState < 4) {
          console.log("Waiting on request");
        }
        if (this.readyState === 4) {
          decreaseOpenRequests();
          console.log("Open requests after XHR: " + window.openRequests);
        }
      })
      return oldOpen.apply(this, args);
    }

    const oldFetch = fetch;
    const newFetch = (input, init) => {
      increaseOpenRequests();
      console.log("Open requests before fetch: " + window.openRequests);
      return oldFetch(input, init).then(resp => {
          decreaseOpenRequests();
          console.log("Open requests after fetch: " + window.openRequests);
          return Promise.resolve(resp);
      }).catch(err => {
        decreaseOpenRequests();
        console.log("Open requests after fetch: " + window.openRequests);
        return Promise.reject(err);
      });
    }
    window.fetch = newFetch;
}
`;

export const CHECK_OPEN_REQUESTS = stripIndent`
if ("sakuliHookEnabled" in window && window.sakuliHookEnabled) {
    return window.openRequests;
}
return 0;
`;

export const RESET_OPEN_REQUESTS = stripIndent`
if ("sakuliHookEnabled" in window && window.sakuliHookEnabled) {
    window.openRequests = 0;
}
`;
