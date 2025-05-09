// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from 'react';
// import type {
//   Prompt,
//   PromptGenerationRequest,
// } from '../models/promptability';
// import {
//   generatePrompt as apiGeneratePrompt,
//   savePrompt   as apiSavePrompt,
//   getPromptHistory as apiGetHistory,
//   logPromptAction  as apiLogAction,
// } from '../utils/api';

// interface PromptContextType {
//   /* data */
//   prompt:        string;
//   selectedText:  string;
//   selectedOptions: {
//     platform: string;
//     role:      string;
//     industry:  string;
//     tone:      string;
//     context:   string;
//   };
//   pageInfo:      { url: string; title: string };
//   isLoading:     boolean;
//   history:       Prompt[];

//   /* actions */
//   setSelectedText: (txt: string, url?: string, title?: string) => void;
//   updateOption:    (type: string, value: string) => void;
//   updateContext:   (val: string) => void;
//   regeneratePrompt:() => Promise<void>;
//   copyPrompt:      () => void;
//   saveCurrentPrompt:() => Promise<void>;
//   loadHistory:     () => Promise<void>;
// }

// /* ----------------– constants –---------------- */
// const DEFAULT_OPTS = {
//   platform: 'chatgpt',
//   role:     '',
//   industry: '',
//   tone:     'professional',
//   context:  '',
// };

// /* ---------------– context –------------------ */
// const PromptContext = createContext<PromptContextType | undefined>(undefined);

// /* ---------------– provider –------------------ */
// export const PromptProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
//   const [prompt,        setPrompt       ] = useState('');
//   const [selectedText,  setSelText      ] = useState('');
//   const [selectedOpts,  setSelectedOpts ] = useState(DEFAULT_OPTS);
//   const [pageInfo,      setPageInfo     ] = useState({ url: '', title: '' });
//   const [isLoading,     setLoading      ] = useState(false);
//   const [history,       setHistory      ] = useState<Prompt[]>([]);

//   /* ---------- helpers ---------- */

//   /** called from UI when user chooses a different value */
//   const updateOption = (type: string, value: string) => {
//     setSelectedOpts(prev => {
//       if (type === 'role') {
//         const [role, industry] = value.split('-');
//         return { ...prev, role, industry };
//       }
//       return { ...prev, [type]: value };
//     });
//   };

//   /** context textarea change */
//   const updateContext = (val: string) =>
//     setSelectedOpts(prev => ({ ...prev, context: val }));

//   /** store the text that came from content-script + optional page info */
//   const setSelectedText = (txt: string, url?: string, title?: string) => {
//     setSelText(txt);
//     if (url   ) setPageInfo(p => ({ ...p, url   }));
//     if (title ) setPageInfo(p => ({ ...p, title }));
//   };

//   /** build payload and POST /prompts/generate */
//   const regeneratePrompt = async () => {
//     if (!selectedText) return;
//     setLoading(true);
  
//     /* ---------- clean payload ---------- */
//     const payload: PromptGenerationRequest = {
//       selectedText,
//       platformId: selectedOpts.platform,
//       formattingOptions: {                      // <-- required, not empty
//         appendInstructions: true,
//         shouldTruncate:     false,
//       },
//       // only add optional fields when they’re non-empty
//       ...(selectedOpts.role      && { roleId:      selectedOpts.role }),
//       ...(selectedOpts.industry  && { industryId:  selectedOpts.industry }),
//       ...(selectedOpts.tone      && { templateId:  selectedOpts.tone }),
//       ...(pageInfo.url           && { pageUrl:     pageInfo.url }),
//       ...(pageInfo.title         && { pageTitle:   pageInfo.title }),
//     };
  
//     try {
//       const res = await apiGeneratePrompt(payload);
//       setPrompt(res.generatedPrompt);
//       await apiLogAction(res.id, 'generate');
//     } catch (err: any) {
//       console.error('generatePrompt failed:', err);
//       setPrompt(`Error: ${err.response?.data?.detail ?? err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /** copy → clipboard + log */
//   const copyPrompt = () => {
//     if (!prompt) return;
//     navigator.clipboard
//       .writeText(prompt)
//       .then(() => apiLogAction('', 'copy'))
//       .catch(console.error);
//   };

//   /** GET /prompts */
//   const loadHistory = async () => {
//     setLoading(true);
//     try {
//       setHistory(await apiGetHistory());
//     } catch (err) {
//       console.error('getPromptHistory failed:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /** POST /prompts  */
//   const saveCurrentPrompt = async () => {
//     if (!prompt) return;
//     setLoading(true);
  
//     try {
//       await apiSavePrompt({
//         generatedPrompt: prompt,
//         selectedText,
//         platformId: selectedOpts.platform,
//         formattingOptions: { appendInstructions: true, shouldTruncate: false },
  
//         ...(selectedOpts.role     && { roleId:     selectedOpts.role }),
//         ...(selectedOpts.industry && { industryId: selectedOpts.industry }),
//         ...(selectedOpts.tone     && { templateId: selectedOpts.tone }),
//         ...(pageInfo.url          && { pageUrl:    pageInfo.url }),
//         ...(pageInfo.title        && { pageTitle:  pageInfo.title }),
//       });
  
//       await loadHistory();               // refresh list after save
//     } catch (err) {
//       console.error('savePrompt failed:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- side-effects ---------- */

//   /** whenever selectedText becomes non-empty -> auto generate */
//   useEffect(() => {
//     if (selectedText) regeneratePrompt().catch(console.error);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedText]);

//   /** initial history fetch */
//   useEffect(() => { loadHistory(); }, []);

//   /* ---------- context value ---------- */
//   const ctx: PromptContextType = {
//     prompt,
//     selectedText,
//     selectedOptions: selectedOpts,
//     pageInfo,
//     isLoading,
//     history,
//     setSelectedText,
//     updateOption,
//     updateContext,
//     regeneratePrompt,
//     copyPrompt,
//     saveCurrentPrompt,
//     loadHistory,
//   };

//   return <PromptContext.Provider value={ctx}>{children}</PromptContext.Provider>;
// };

// /* ----------------– hook –-------------------- */
// export function usePrompt(): PromptContextType {
//   const ctx = useContext(PromptContext);
//   if (!ctx) throw new Error('usePrompt must be used within <PromptProvider>');
//   return ctx;
// }


/* =========================================================================
 *  PromptContext – handles UI state + calls backend
 *  (with verbose logging for troubleshooting)
 * ========================================================================= */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Prompt, PromptGenerationRequest } from '../models/promptability';
import {
  generatePrompt   as apiGeneratePrompt,
  savePrompt       as apiSavePrompt,
  getPromptHistory as apiGetHistory,
  logPromptAction  as apiLogAction,
} from '../utils/api';
import { waitForFirebaseAuth } from '../utils/firebaseClient';

/* ---------- helpers ---------- */
const log = (...args: any[]) =>
  import.meta.env.DEV && console.log('[PromptCtx]', ...args);

/* ---------- shapes ---------- */
interface Opts {
  platform: string;
  role:     string;
  industry: string;
  tone:     string;
  context:  string;
}
interface PromptCtxShape {
  prompt: string;
  selectedText: string;
  selectedOptions: Opts;
  pageInfo: { url: string; title: string };
  isLoading: boolean;
  history: Prompt[];

  setSelectedText(txt: string, url?: string, title?: string): void;
  updateOption(type: string, val: string): void;
  updateContext(val: string): void;
  regeneratePrompt(): Promise<void>;
  copyPrompt(): void;
  saveCurrentPrompt(): Promise<void>;
  loadHistory(): Promise<void>;
}

/* ---------- constants ---------- */
const DEFAULT_OPTS: Opts = {
  platform: 'chatgpt',
  role: '',
  industry: '',
  tone: 'professional',
  context: '',
};

/* ---------- context ---------- */
const PromptCtx = createContext<PromptCtxShape | undefined>(undefined);

/* =========================================================================
 *  Provider
 * ========================================================================= */
export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prompt,  setPrompt]  = useState('');
  const [text,    setText]    = useState('');
  const [opts,    setOpts]    = useState<Opts>(DEFAULT_OPTS);
  const [page,    setPage]    = useState({ url: '', title: '' });
  const [busy,    setBusy]    = useState(false);
  const [hist,    setHist]    = useState<Prompt[]>([]);
  const [haveUsr, setHaveUsr] = useState(false);

  /* -------- wait for Firebase session once -------- */
  useEffect(() => {
    waitForFirebaseAuth().then(u => {
      log('Firebase auth resolved → haveUsr =', !!u);
      setHaveUsr(!!u);
    });
  }, []);

  /* ------------------------------------------------------------------ *
   *  UTIL: small helper to log nicely in dev mode
   * ------------------------------------------------------------------ */
  const dbg = (...args: any[]) =>
    import.meta.env.DEV && console.log('[PromptCtx]', ...args);

  /* -------- helpers (same code but with dbg) -------- */
  const updateOption = (t: string, v: string) => {
    dbg('updateOption', t, v);
    setOpts(p =>
      t === 'role'
        ? (() => {
            const [role, ind] = v.split('-');
            return { ...p, role, industry: ind };
          })()
        : { ...p, [t]: v }
    );
  };

  const updateContext = (v: string) => setOpts(p => ({ ...p, context: v }));

  /* -------- selection from content-script -------- */
  const setSelectedText = (t: string, url?: string, title?: string) => {
    log('setSelectedText', t, url, title);
    setText(t);
    if (url)   setPage(p => ({ ...p, url }));
    if (title) setPage(p => ({ ...p, title }));
  };

  /* -------- API calls -------- */
  const regeneratePrompt = async () => {
    if (!text || !haveUsr) {
      dbg('regeneratePrompt skipped (missing text or user)');
      return;
    }

    const payload: PromptGenerationRequest = {
      selectedText: text,
      platformId:   opts.platform,
      formattingOptions: { appendInstructions: true, shouldTruncate: false },
      ...(opts.role     && { roleId:     opts.role }),
      ...(opts.industry && { industryId: opts.industry }),
      ...(opts.tone     && { templateId: opts.tone }),
      ...(page.url      && { pageUrl:    page.url }),
      ...(page.title    && { pageTitle:  page.title }),
    };

    dbg('▶ POST /prompts/generate payload', payload);
    setBusy(true);
    try {
      const res = await apiGeneratePrompt(payload);
      dbg('✔︎ generatedPrompt received', res);
      setPrompt(res.generatedPrompt);
      await apiLogAction(res.id, 'generate');
    } catch (e: any) {
      dbg('✖︎ generatePrompt failed', e);
      setPrompt(`Error: ${e.response?.data?.detail ?? e.message}`);
    } finally {
      setBusy(false);
    }
  };

  const saveCurrentPrompt = async () => {
    if (!prompt || !haveUsr) return;
    dbg('▶ POST /prompts (save prompt)');
    setBusy(true);
    try {
      await apiSavePrompt({
        generatedPrompt: prompt,
        selectedText:    text,
        platformId:      opts.platform,
        formattingOptions: { appendInstructions: true, shouldTruncate: false },
        ...(opts.role     && { roleId:     opts.role }),
        ...(opts.industry && { industryId: opts.industry }),
        ...(opts.tone     && { templateId: opts.tone }),
        ...(page.url      && { pageUrl:    page.url }),
        ...(page.title    && { pageTitle:  page.title }),
      });
      dbg('✔︎ prompt saved OK');
      await loadHistory();
    } catch (e) {
      dbg('✖︎ savePrompt failed', e);
    } finally {
      setBusy(false);
    }
  };

  /* ------------------------------------------------------------------ *
   *  loadHistory – log size returned
   * ------------------------------------------------------------------ */
  const loadHistory = async () => {
    if (!haveUsr) return;
    setBusy(true);
    try {
      const list = await apiGetHistory();
      dbg(`✔︎ history loaded (${list.length} items)`);
      setHist(list);
    } catch (e) {
      dbg('✖︎ getPromptHistory failed', e);
    } finally {
      setBusy(false);
    }
  };


  const copyPrompt = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt)
      .then(() => apiLogAction('', 'copy'))
      .catch(console.error);
  };

  /* -------- effects --------- */
  useEffect(() => { if (text) regeneratePrompt(); }, [text]);         // eslint-disable-line
  useEffect(() => { if (haveUsr) loadHistory(); }, [haveUsr]);        // once after auth

  /* -------- expose ctx in DEV -------- */
  const ctxValue: PromptCtxShape = {
    prompt,
    selectedText: text,
    selectedOptions: opts,
    pageInfo: page,
    isLoading: busy,
    history: hist,

    setSelectedText,
    updateOption,
    updateContext,
    regeneratePrompt,
    copyPrompt,
    saveCurrentPrompt,
    loadHistory,
  };

  if (import.meta.env.DEV) {
    // @ts-ignore  debug aid
    window.__promptCtx = ctxValue;
  }

  return <PromptCtx.Provider value={ctxValue}>{children}</PromptCtx.Provider>;
};

/* =========================================================================
 *  Hook
 * ========================================================================= */
export const usePrompt = () => {
  const c = useContext(PromptCtx);
  if (!c) throw new Error('usePrompt must be used within <PromptProvider>');
  return c;
};
