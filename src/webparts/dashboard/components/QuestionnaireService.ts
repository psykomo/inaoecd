export interface IQuestionnaire {
  id: string;
  title: string;
  url: string;
  status: 'Draft' | 'Published' | 'Work in Progress' | 'Submit for Review' | 'Need Revision' | 'Under Review' | 'Completed' | 'Sent to OECD';
  responses: number;
  lastModified: string;
  dateReceived: string;
  deadline: string;
  dateCompleted?: string;
  dateSubmittedToOECD?: string;
  batchId: string;
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  sectionName: string;
}

export interface IFollowUpLink {
  id: string;
  label: string;
  url: string;
  category: 'OECD Request' | 'Section Answer';
}

export type FollowUpType = 'Clarification' | 'Additional Question' | 'Data Request';

export interface IFollowUp {
  id: string;
  questionnaireId: string;
  subject: string;
  types: FollowUpType[];
  status: 'Open' | 'In Progress' | 'Answered' | 'Closed';
  dateReceived: string;
  deadline: string;
  description: string;
  links: IFollowUpLink[];
}

const STORAGE_KEY = 'INA_OECD_QUESTIONNAIRES';
const FOLLOWUP_STORAGE_KEY = 'INA_OECD_FOLLOWUPS';

export const MASTER_SECTIONS = [
  'Environment',
  'Trade',
  'Finance',
  'Education',
  'Health',
  'Employment'
];

const DEFAULT_DATA: IQuestionnaire[] = [
  { 
    id: '1', 
    title: 'Employee Engagement Survey', 
    url: 'https://tenant.sharepoint.com/sites/hr/surveys/ees2025', 
    status: 'Draft', 
    responses: 0, 
    lastModified: '2025-01-28',
    dateReceived: '2025-01-20',
    deadline: '2025-02-20',
    batchId: 'Batch 1',
    totalQuestions: 25,
    answeredQuestions: 0,
    unansweredQuestions: 25,
    sectionName: 'Employment'
  },
  { 
    id: '2', 
    title: 'Market Access Review', 
    url: 'https://tenant.sharepoint.com/sites/trade/reviews/ma2025', 
    status: 'Published', 
    responses: 12, 
    lastModified: '2025-01-25',
    dateReceived: '2025-01-15',
    deadline: '2025-02-15',
    batchId: 'Batch 1',
    totalQuestions: 15,
    answeredQuestions: 5,
    unansweredQuestions: 10,
    sectionName: 'Trade'
  },
  { 
    id: '3', 
    title: 'Fiscal Policy Assessment', 
    url: 'https://tenant.sharepoint.com/sites/finance/assessments/fp2025', 
    status: 'Work in Progress', 
    responses: 45, 
    lastModified: '2025-01-29',
    dateReceived: '2025-01-10',
    deadline: '2025-02-10',
    batchId: 'Batch 2',
    totalQuestions: 30,
    answeredQuestions: 22,
    unansweredQuestions: 8,
    sectionName: 'Finance'
  },
  { 
    id: '4', 
    title: 'Curriculum Quality Audit', 
    url: 'https://tenant.sharepoint.com/sites/edu/audits/cq2025', 
    status: 'Submit for Review', 
    responses: 150, 
    lastModified: '2025-01-20',
    dateReceived: '2025-01-05',
    deadline: '2025-02-05',
    batchId: 'Batch 1',
    totalQuestions: 20,
    answeredQuestions: 20,
    unansweredQuestions: 0,
    sectionName: 'Education'
  },
  { 
    id: '5', 
    title: 'Environmental Impact Study', 
    url: 'https://tenant.sharepoint.com/sites/env/studies/ei2025', 
    status: 'Need Revision', 
    responses: 30, 
    lastModified: '2025-01-30',
    dateReceived: '2025-01-01',
    deadline: '2025-02-01',
    batchId: 'Batch 2',
    totalQuestions: 40,
    answeredQuestions: 35,
    unansweredQuestions: 5,
    sectionName: 'Environment'
  },
  { 
    id: '6', 
    title: 'Healthcare Accessibility Poll', 
    url: 'https://tenant.sharepoint.com/sites/health/polls/ha2025', 
    status: 'Under Review', 
    responses: 210, 
    lastModified: '2025-01-15',
    dateReceived: '2024-12-15',
    deadline: '2025-01-15',
    batchId: 'Batch 1',
    totalQuestions: 12,
    answeredQuestions: 12,
    unansweredQuestions: 0,
    sectionName: 'Health'
  },
  { 
    id: '7', 
    title: 'Trade Barrier Analysis', 
    url: 'https://tenant.sharepoint.com/sites/trade/analysis/tb2025', 
    status: 'Completed', 
    responses: 85, 
    lastModified: '2025-01-10',
    dateReceived: '2024-12-10',
    deadline: '2025-01-10',
    dateCompleted: '2025-01-10',
    batchId: 'Batch 1',
    totalQuestions: 18,
    answeredQuestions: 18,
    unansweredQuestions: 0,
    sectionName: 'Trade'
  },
  { 
    id: '8', 
    title: 'OECD Digital Economy Review', 
    url: 'https://tenant.sharepoint.com/sites/digital/reviews/oecd2025', 
    status: 'Sent to OECD', 
    responses: 120, 
    lastModified: '2025-01-05',
    dateReceived: '2024-12-05',
    deadline: '2025-01-05',
    dateCompleted: '2025-01-02',
    dateSubmittedToOECD: '2025-01-05',
    batchId: 'Batch 1',
    totalQuestions: 50,
    answeredQuestions: 50,
    unansweredQuestions: 0,
    sectionName: 'Finance'
  }
];

export class QuestionnaireService {
  public static getQuestionnaires(): IQuestionnaire[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.saveQuestionnaires(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    return JSON.parse(data);
  }

  public static saveQuestionnaires(questionnaires: IQuestionnaire[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questionnaires));
  }

  public static addQuestionnaire(data: Partial<IQuestionnaire>): void {
    const questionnaires = this.getQuestionnaires();
    const newQ: IQuestionnaire = {
      id: Date.now().toString(),
      title: data.title || '',
      url: data.url || '',
      status: 'Draft',
      responses: 0,
      lastModified: new Date().toISOString().split('T')[0],
      dateReceived: data.dateReceived || new Date().toISOString().split('T')[0],
      deadline: data.deadline || '',
      dateCompleted: data.dateCompleted,
      dateSubmittedToOECD: data.dateSubmittedToOECD,
      batchId: data.batchId || '',
      totalQuestions: data.totalQuestions || 0,
      answeredQuestions: data.answeredQuestions || 0,
      unansweredQuestions: (data.totalQuestions || 0) - (data.answeredQuestions || 0),
      sectionName: data.sectionName || MASTER_SECTIONS[0]
    };
    questionnaires.push(newQ);
    this.saveQuestionnaires(questionnaires);
  }

  public static deleteQuestionnaire(id: string): void {
    const questionnaires = this.getQuestionnaires().filter(q => q.id !== id);
    this.saveQuestionnaires(questionnaires);
  }

  public static getQuestionnaireById(id: string): IQuestionnaire | undefined {
    return this.getQuestionnaires().find(q => q.id === id);
  }

  public static updateQuestionnaire(updatedQ: IQuestionnaire): void {
    const questionnaires = this.getQuestionnaires();
    const index = questionnaires.findIndex(q => q.id === updatedQ.id);
    if (index !== -1) {
      questionnaires[index] = {
        ...updatedQ,
        lastModified: new Date().toISOString().split('T')[0]
      };
      this.saveQuestionnaires(questionnaires);
    }
  }

  // Follow-up Methods
  public static getFollowUps(): IFollowUp[] {
    const data = localStorage.getItem(FOLLOWUP_STORAGE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  }

  public static saveFollowUps(followUps: IFollowUp[]): void {
    localStorage.setItem(FOLLOWUP_STORAGE_KEY, JSON.stringify(followUps));
  }

  public static addFollowUp(data: Partial<IFollowUp>): void {
    const followUps = this.getFollowUps();
    const newF: IFollowUp = {
      id: Date.now().toString(),
      questionnaireId: data.questionnaireId || '',
      subject: data.subject || '',
      types: data.types || ['Clarification'],
      status: data.status || 'Open',
      dateReceived: data.dateReceived || new Date().toISOString().split('T')[0],
      deadline: data.deadline || '',
      description: data.description || '',
      links: data.links || []
    };
    followUps.push(newF);
    this.saveFollowUps(followUps);
  }

  public static deleteFollowUp(id: string): void {
    const followUps = this.getFollowUps().filter(f => f.id !== id);
    this.saveFollowUps(followUps);
  }

  public static updateFollowUp(updatedF: IFollowUp): void {
    const followUps = this.getFollowUps();
    const index = followUps.findIndex(f => f.id === updatedF.id);
    if (index !== -1) {
      followUps[index] = updatedF;
      this.saveFollowUps(followUps);
    }
  }
}
