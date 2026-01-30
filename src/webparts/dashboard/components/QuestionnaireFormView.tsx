import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.scss';
import { QuestionnaireService, IQuestionnaire, MASTER_SECTIONS } from './QuestionnaireService';

export const QuestionnaireFormView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = React.useState<Partial<IQuestionnaire>>({
    title: '',
    url: '',
    status: 'Draft',
    batchId: '',
    totalQuestions: 0,
    answeredQuestions: 0,
    sectionName: MASTER_SECTIONS[0],
    dateReceived: new Date().toISOString().split('T')[0],
    deadline: '',
    dateCompleted: '',
    dateSubmittedToOECD: ''
  });

  React.useEffect(() => {
    if (isEditMode) {
      const data = QuestionnaireService.getQuestionnaireById(id);
      if (data) {
        setFormData(data);
      } else {
        alert('Questionnaire not found');
        navigate('/questionnaires');
      }
    }
  }, [id, isEditMode, navigate]);

  const handleSave = (): void => {
    if (!formData.title || !formData.url) {
      alert('Title and URL are required');
      return;
    }

    const finalData = {
      ...formData,
      unansweredQuestions: (Number(formData.totalQuestions) || 0) - (Number(formData.answeredQuestions) || 0)
    };

    if (isEditMode) {
      QuestionnaireService.updateQuestionnaire(finalData as IQuestionnaire);
    } else {
      QuestionnaireService.addQuestionnaire(finalData);
    }

    navigate('/questionnaires');
  };

  return (
    <div className={styles.chartContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className={styles.chartTitle} style={{ margin: 0 }}>
          {isEditMode ? 'Edit Questionnaire' : 'New Questionnaire'}
        </h3>
        <button onClick={() => navigate('/questionnaires')} className={styles.navButton} style={{ margin: 0, backgroundColor: '#605e5c' }}>
          Cancel
        </button>
      </div>

      <div style={{ 
        padding: '20px', 
        border: '1px solid #edebe9', 
        borderRadius: '4px', 
        backgroundColor: '#faf9f8'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="Enter questionnaire title"
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>URL</label>
            <input 
              type="text" 
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="https://..."
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Batch ID</label>
            <input 
              type="text" 
              value={formData.batchId}
              onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="e.g. Batch 1"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Section</label>
            <select 
              value={formData.sectionName}
              onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {MASTER_SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Total Questions</label>
            <input 
              type="number" 
              value={formData.totalQuestions}
              onChange={(e) => setFormData({ ...formData, totalQuestions: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Answered Questions</label>
            <input 
              type="number" 
              value={formData.answeredQuestions}
              onChange={(e) => setFormData({ ...formData, answeredQuestions: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Date Received</label>
            <input 
              type="date" 
              value={formData.dateReceived}
              onChange={(e) => setFormData({ ...formData, dateReceived: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Deadline</label>
            <input 
              type="date" 
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Date Completed</label>
            <input 
              type="date" 
              value={formData.dateCompleted}
              onChange={(e) => setFormData({ ...formData, dateCompleted: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Date Submitted to OECD</label>
            <input 
              type="date" 
              value={formData.dateSubmittedToOECD}
              onChange={(e) => setFormData({ ...formData, dateSubmittedToOECD: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          {isEditMode && (
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Work in Progress">Work in Progress</option>
                <option value="Submit for Review">Submit for Review</option>
                <option value="Need Revision">Need Revision</option>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
                <option value="Sent to OECD">Sent to OECD</option>
              </select>
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', gridColumn: 'span 2' }}>
            <button 
              onClick={handleSave} 
              className={styles.navButton} 
              style={{ margin: 0, backgroundColor: '#107c10', padding: '10px 24px' }}
            >
              {isEditMode ? 'Save Changes' : 'Create Questionnaire'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
