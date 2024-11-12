// src/core/progress.ts
export const userProgress = new Map<
  string,
  {
    step: string;
    name?: string;
    phone?: string;
    age?: number;
    region?: string;
    isQuizActive?: boolean;
    currentQuestionIndex: number;
    questions: any[];
    tempData?: {
      name?: string;
      phone?: string;
      age?: number;
      region?: string;
    };
  }
>();
