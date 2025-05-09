// // TypeScript interfaces for the Promptability app

// export interface UserProfile {
//   fullName: string;
//   jobType: string;
//   experienceLevel: string;
//   preferredTone: string;
//   language: string;
//   customContext?: string;
// }

// export interface Platform {
//   id: string;
//   name: string;
// }

// export interface RoleIndustry {
//   id: string;
//   name: string;
// }

// export interface Tone {
//   id: string;
//   name: string;
// }

// export interface PromptFormattingOptions {
//   appendInstructions: boolean;
//   shouldTruncate: boolean;
//   includeProfile?: boolean;
// }

// export interface PromptRequest {
//   selectedText: string;
//   platformId: string;
//   roleId: string;
//   industryId: string;
//   toneId: string; 
//   context: string;
//   pageUrl: string;
//   pageTitle: string;
//   templateId: string;
//   subcategoryId?: string;
//   formattingOptions: FormattingOptions;
// }

// export interface Prompt {
//   id: string;
//   userId: string;
//   selectedText: string;
//   generatedPrompt: string;
//   roleId: string;
//   industryId: string;
//   subcategoryId?: string;
//   templateId: string;
//   platformId: string;
//   formattingOptions: PromptFormattingOptions;
//   pageUrl: string;
//   pageTitle: string;
//   createdAt: string;
//   favorite?: boolean;
//   tags?: string[];
//   usageCount?: number;
//   lastUsedAt?: string;
// }

// export interface PromptAction {
//   id: string;
//   promptId: string;
//   userId: string;
//   actionType: 'copy' | 'replace' | 'send';
//   platformId?: string;
//   timestamp: string;
// }

// export interface AppSettings {
//   defaultPlatform: string;
//   defaultRole: string;
//   defaultTone: string;
//   saveHistory: boolean;
//   theme: 'light' | 'dark';
// }

// src/models/promptability.ts

// src/models/promptability.ts

// --- user profile ---
export interface UserProfile {
  fullName:         string;
  jobType:          string;
  experienceLevel:  string;
  preferredTone:    string;
  language:         string;
  customContext?:   string;
}

// --- dropdown options ---
export interface Platform {
  id:   string;
  name: string;
}

export interface RoleIndustry {
  id:   string;
  name: string;
}

export interface Tone {
  id:   string;
  name: string;
}

// --- prompt formatting flags ---
export interface PromptFormattingOptions {
  appendInstructions: boolean;
  shouldTruncate:      boolean;
  includeProfile?:     boolean;
}

// --- request payload to /prompts/generate ---
export interface PromptRequest {
  selectedText:      string;
  platformId:        string;
  roleId:            string;
  industryId:        string;
  toneId:            string;                  // ← make sure you pass this now
  context:           string;
  pageUrl:           string;
  pageTitle:         string;
  templateId:        string;
  subcategoryId?:    string;
  formattingOptions: PromptFormattingOptions;  // ← fixed to PromptFormattingOptions
}

// --- prompt object returned by API ---
export interface Prompt {
  id:                string;
  userId:            string;
  selectedText:      string;
  generatedPrompt:   string;
  roleId:            string;
  industryId:        string;
  subcategoryId?:    string;
  templateId:        string;
  platformId:        string;
  formattingOptions: PromptFormattingOptions;
  pageUrl:           string;
  pageTitle:         string;
  createdAt:         string;
  favorite?:         boolean;
  tags?:             string[];
  usageCount?:       number;
  lastUsedAt?:       string;
}

// --- logging user actions on a prompt ---
export interface PromptAction {
  id:          string;
  promptId:    string;
  userId:      string;
  actionType:  'copy' | 'replace' | 'send';
  platformId?: string;
  timestamp:   string;
}

// --- app-wide settings (persisted locally) ---
export interface AppSettings {
  defaultPlatform: string;
  defaultRole:     string;
  defaultTone:     string;
  saveHistory:     boolean;
  theme:           'light' | 'dark';
}

export interface PromptGenerationRequest {
  selectedText:      string;
  platformId:        string;
  roleId?:           string;
  industryId?:       string;
  templateId?:       string;          
  pageUrl?:          string;
  pageTitle?:        string;
  subcategoryId?:    string;
  formattingOptions: {
    appendInstructions: boolean;
    shouldTruncate:     boolean;
  };
}