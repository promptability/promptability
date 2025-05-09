// import React, { useState, useEffect } from 'react';
// import { ThemeProvider } from './contexts/ThemeContext';
// import { PromptProvider, usePrompt } from './contexts/PromptContext';
// import { useAuth }       from './hooks/useAuth';
// import Header from './components/layout/Header';
// import Container from './components/layout/Container';
// import PromptEditor from './components/prompt/PromptEditor';
// import PromptActions from './components/prompt/PromptActions';
// import SettingsPage from './components/settings/SettingsPage';
// import PromptHistory from './components/PromptHistory';
// import Toast from './components/common/Toast';
// import LoginSignup from './components/auth/LoginSignup';


// // Sample data
// const platforms = [
//   { id: 'chatgpt', name: 'ChatGPT' },
//   { id: 'claude', name: 'Claude' },
//   { id: 'gemini', name: 'Gemini' },
// ];

// const roleIndustries = [
//   { id: 'writer-tech', name: 'Writer (Tech)' },
//   { id: 'designer-fashion', name: 'Designer (Fashion)' },
//   { id: 'marketer-finance', name: 'Marketer (Finance)' },
// ];

// const tones = [
//   { id: 'professional', name: 'Professional' },
//   { id: 'casual', name: 'Casual' },
//   { id: 'friendly', name: 'Friendly' },
// ];

// const defaultSettings = {
//   platform: 'chatgpt',
//   role: 'writer-tech',
//   tone: 'professional',
//   saveHistory: true,
// };

// interface AppProps {
//   initialData?: {
//     selectedText?: string;
//     pageUrl?: string;
//     pageTitle?: string;
//   };
// }

// const PromptabilityApp: React.FC<AppProps> = ({ initialData }) => {
//   const {
//     prompt,
//     selectedOptions,
//     updateOption,
//     updateContext,
//     regeneratePrompt,
//     copyPrompt,
//     saveCurrentPrompt,
//     setSelectedText
//   } = usePrompt();

//   const [showSettings, setShowSettings] = useState(false);
//   const [showHistory, setShowHistory] = useState(false);
//   const [showToast, setShowToast] = useState<{ visible: boolean, message: string }>({
//     visible: false,
//     message: ''
//   });
//   const [user, setUser] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Handle initial data from content script
//   useEffect(() => {
//     if (initialData?.selectedText) {
//       setSelectedText(initialData.selectedText, initialData.pageUrl, initialData.pageTitle);
//     }
//   }, [initialData]);

//   useEffect(() => {
//     const unsubscribe = onAuthChange((authUser) => {
//       setUser(authUser);
//       setIsLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);
//   const { user, ready, busy } = useAuth();

//   const handleReplace = async () => {
//     await regeneratePrompt();
//     showToastMessage('Prompt regenerated!');
//   };

//   const handleCopy = () => {
//     copyPrompt();
//     showToastMessage('Copied to clipboard!');
//   };

//   const handleSave = async () => {
//     await saveCurrentPrompt();
//     showToastMessage('Prompt saved!');
//   };

//   const showToastMessage = (message: string) => {
//     setShowToast({ visible: true, message });
//     setTimeout(() => {
//       setShowToast({ visible: false, message: '' });
//     }, 2000);
//   };

//   const handleCloseApp = () => {
//     window.close(); // Extension-specific behavior
//   };

//   // const handleSaveSettings = (settings: any) => {
//   //   localStorage.setItem('promptabilitySettings', JSON.stringify(settings));
//   //   updateOption('platform', settings.platform);
//   //   updateOption('role', settings.role);
//   // };

//   if (!ready || busy) {
//     return (
//       <Container>
//         <div className="flex items-center justify-center h-48">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       </Container>
//     );
//   }

//   if (!user && defaultSettings.saveHistory) {
//     return (
//       <Container>
//         <LoginSignup onLogin={() => setIsLoading(true)} />
//       </Container>
//     );
//   }

//   if (showSettings) {
//     return (
//       <Container>
//         <SettingsPage
//           onBack={() => setShowSettings(false)}
//           platforms={platforms}
//           roleIndustries={roleIndustries}
//           tones={tones}
//         />
//       </Container>
//     );
//   }
  

//   if (showHistory) {
//     return (
//       <Container>
//         <PromptHistory
//           onBack={() => setShowHistory(false)}
//           onSelectPrompt={() => setShowHistory(false)}
//         />
//       </Container>
//     );
//   }

//   return (
//     <Container>
//       <div className="flex flex-col h-full">
//         <Header
//           onSettingsClick={() => setShowSettings(true)}
//           onClose={handleCloseApp}
//         />

//         <PromptEditor
//           promptText={prompt}
//           platforms={platforms}
//           roleIndustries={roleIndustries}
//           tones={tones}
//           selectedOptions={selectedOptions}
//           onOptionChange={updateOption}
//           onContextChange={updateContext}
//         />

//         <PromptActions
//           onReplace={handleReplace}
//           onCopy={handleCopy}
//           onSave={handleSave}
//         />

//         {showToast.visible && (
//           <Toast message={showToast.message} />
//         )}
//       </div>
//     </Container>
//   );
// };

// const App: React.FC<AppProps> = ({ initialData }) => {
//   return (
//     <ThemeProvider>
//       <PromptProvider>
//         <div className="w-full h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
//           <PromptabilityApp initialData={initialData} />
//         </div>
//       </PromptProvider>
//     </ThemeProvider>
//   );
// };

// export default App;

/* ---------------------------------------------------------------------- */
/*  Promptability – top-level React tree                                   */
/* ---------------------------------------------------------------------- */
import React, { useEffect, useState } from 'react';

import { ThemeProvider }           from './contexts/ThemeContext';
import { PromptProvider, usePrompt } from './contexts/PromptContext';
import { useAuth }                 from './hooks/useAuth';

import Header          from './components/layout/Header';
import Container       from './components/layout/Container';
import PromptEditor    from './components/prompt/PromptEditor';
import PromptActions   from './components/prompt/PromptActions';
import SettingsPage    from './components/settings/SettingsPage';
import PromptHistory   from './components/PromptHistory';
import Toast           from './components/common/Toast';
import LoginSignup     from './components/auth/LoginSignup';

/* ---------- static dropdown data (could also come from API) ---------- */
const platforms = [
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'claude',  name: 'Claude'  },
  { id: 'gemini',  name: 'Gemini'  },
];

const roleIndustries = [
  { id: 'writer-tech',     name: 'Writer (Tech)'     },
  { id: 'designer-fashion',name: 'Designer (Fashion)'},
  { id: 'marketer-finance',name: 'Marketer (Finance)'},
];

const tones = [
  { id: 'professional', name: 'Professional' },
  { id: 'casual',       name: 'Casual'       },
  { id: 'friendly',     name: 'Friendly'     },
];

interface AppProps {
  initialData?: {
    selectedText?: string;
    pageUrl?: string;
    pageTitle?: string;
  };
}

/* ---------------------------------------------------------------------- */
/*  Inner app (requires providers already mounted)                         */
/* ---------------------------------------------------------------------- */
const PromptabilityApp: React.FC<AppProps> = ({ initialData }) => {
  /* ---------- prompt state ---------- */
  const {
    prompt,
    selectedOptions,
    updateOption,
    updateContext,
    regeneratePrompt,
    copyPrompt,
    saveCurrentPrompt,
    setSelectedText,
  } = usePrompt();

  /* ---------- auth ---------- */
  const { user, ready, busy } = useAuth();   // ready = auth state known, busy = hook busy

  /* ---------- local UI state ---------- */
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory,  setShowHistory ]  = useState(false);
  const [toast, setToast] = useState<{visible:boolean; message:string}>({
    visible: false,
    message: '',
  });

  /* ---------- initial text from content-script ---------- */
  useEffect(() => {
    if (initialData?.selectedText) {
      setSelectedText(initialData.selectedText, initialData.pageUrl, initialData.pageTitle);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  /* ---------- toast helper ---------- */
  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 2000);
  };

  /* ---------- action handlers ---------- */
  const handleReplace = async () => { await regeneratePrompt(); showToast('Prompt regenerated!'); };
  const handleCopy    = ()   => { copyPrompt();                showToast('Copied to clipboard!'); };
  const handleSave    = async () => { await saveCurrentPrompt(); showToast('Prompt saved!'); };

  const handleClose   = () => window.close();   // popup-specific

  /* ---------- conditional screens ---------- */
  if (!ready || busy) {                    /* auth still initialising */
    return (
      <Container>
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      </Container>
    );
  }

  if (!user) {                             /* not signed in */
    return (
      <Container>
        <LoginSignup onLogin={() => {/* no-op: useAuth will refresh */}} />
      </Container>
    );
  }

  if (showSettings) {                      /* settings */
    return (
      <Container>
        <SettingsPage
          onBack={() => setShowSettings(false)}
          platforms={platforms}
          roleIndustries={roleIndustries}
          tones={tones}
        />
      </Container>
    );
  }

  if (showHistory) {                       /* history */
    return (
      <Container>
        <PromptHistory
          onBack={() => setShowHistory(false)}
          onSelectPrompt={() => setShowHistory(false)}
        />
      </Container>
    );
  }

  /* ---------- normal prompt editor screen ---------- */
  return (
    <Container>
      <div className="flex flex-col h-full">
        <Header onSettingsClick={() => setShowSettings(true)} onClose={handleClose} />

        <PromptEditor
          promptText={prompt}
          platforms={platforms}
          roleIndustries={roleIndustries}
          tones={tones}
          selectedOptions={selectedOptions}
          onOptionChange={updateOption}
          onContextChange={updateContext}
        />

        <PromptActions onReplace={handleReplace} onCopy={handleCopy} onSave={handleSave} />

        {toast.visible && <Toast message={toast.message} />}
      </div>
    </Container>
  );
};

/* ---------------------------------------------------------------------- */
/*  Root component with all providers                                      */
/* ---------------------------------------------------------------------- */
const App: React.FC<AppProps> = ({ initialData }) => (
  <ThemeProvider>
    <PromptProvider>
      <div className="w-full h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <PromptabilityApp initialData={initialData} />
      </div>
    </PromptProvider>
  </ThemeProvider>
);

export default App;
