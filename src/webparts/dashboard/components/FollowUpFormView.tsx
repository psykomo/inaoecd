import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.scss';
import { QuestionnaireService, IFollowUp, IQuestionnaire, IFollowUpLink, FollowUpType } from './QuestionnaireService';

export const FollowUpFormView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [questionnaires, setQuestionnaires] = React.useState<IQuestionnaire[]>([]);
  const [formData, setFormData] = React.useState<Partial<IFollowUp>>({
    questionnaireId: '',
    subject: '',
    types: ['Clarification'],
    status: 'Open',
    dateReceived: new Date().toISOString().split('T')[0],
    deadline: '',
    description: '',
    links: []
  });

  // State for new link form
  const [newLink, setNewLink] = React.useState<Partial<IFollowUpLink>>({
    label: '',
    url: '',
    category: 'OECD Request'
  });

  React.useEffect(() => {
    const qs = QuestionnaireService.getQuestionnaires();
    setQuestionnaires(qs);
    if (qs.length > 0 && !isEditMode) {
      setFormData(prev => ({ ...prev, questionnaireId: qs[0].id }));
    }

    if (isEditMode) {
      const followUps = QuestionnaireService.getFollowUps();
      const data = followUps.find(f => f.id === id);
      if (data) {
        setFormData(data);
      } else {
        alert('Follow-up not found');
        navigate('/followups');
      }
    }
  }, [id, isEditMode, navigate]);

  const handleSave = (): void => {
    if (!formData.subject || !formData.questionnaireId) {
      alert('Subject and Questionnaire are required');
      return;
    }

    if (isEditMode) {
      QuestionnaireService.updateFollowUp(formData as IFollowUp);
    } else {
      QuestionnaireService.addFollowUp(formData);
    }

    navigate('/followups');
  };

  const addLink = (): void => {
    if (!newLink.label || !newLink.url) {
      alert('Link label and URL are required');
      return;
    }
    const linkToAdd: IFollowUpLink = {
      id: Date.now().toString(),
      label: newLink.label,
      url: newLink.url,
      category: newLink.category as any
    };
    setFormData({
      ...formData,
      links: [...(formData.links || []), linkToAdd]
    });
    setNewLink({ label: '', url: '', category: 'OECD Request' });
  };

  const removeLink = (linkId: string): void => {
    setFormData({
      ...formData,
      links: (formData.links || []).filter(l => l.id !== linkId)
    });
  };

  const handleTypeChange = (type: FollowUpType): void => {
    const currentTypes = formData.types || [];
    if (currentTypes.indexOf(type) !== -1) {
      if (currentTypes.length > 1) {
        setFormData({ ...formData, types: currentTypes.filter(t => t !== type) });
      }
    } else {
      setFormData({ ...formData, types: [...currentTypes, type] });
    }
  };

  return (
    <div className={styles.chartContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className={styles.chartTitle} style={{ margin: 0 }}>
          {isEditMode ? 'Edit Follow-up' : 'New Follow-up'}
        </h3>
        <button onClick={() => navigate('/followups')} className={styles.navButton} style={{ margin: 0, backgroundColor: '#605e5c' }}>
          Cancel
        </button>
      </div>

      <div style={{ padding: '20px', border: '1px solid #edebe9', borderRadius: '4px', backgroundColor: '#faf9f8' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Related Questionnaire</label>
            <select 
              value={formData.questionnaireId}
              onChange={(e) => setFormData({ ...formData, questionnaireId: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="">Select a questionnaire...</option>
              {questionnaires.map(q => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Subject</label>
            <input 
              type="text" 
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="e.g. Clarification on Section 5"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Type (Multiple)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px' }}>
              {(['Clarification', 'Additional Question', 'Data Request'] as FollowUpType[]).map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={(formData.types || []).indexOf(type) !== -1}
                    onChange={() => handleTypeChange(type)}
                  />
                  <span style={{ fontSize: '14px' }}>{type}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Answered">Answered</option>
              <option value="Closed">Closed</option>
            </select>
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
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
              placeholder="Provide more details about the OECD request..."
            />
          </div>

          {/* Multiple Links Section */}
          <div style={{ gridColumn: 'span 2', marginTop: '10px', padding: '15px', backgroundColor: 'white', border: '1px solid #eee', borderRadius: '4px' }}>
            <h4 style={{ marginTop: 0 }}>Reference Links & Files</h4>
            
            {/* List existing links */}
            <div style={{ marginBottom: '15px' }}>
              {(formData.links || []).map(link => (
                <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #f3f2f1' }}>
                  <div>
                    <span style={{ 
                      fontSize: '10px', 
                      padding: '2px 6px', 
                      borderRadius: '10px', 
                      marginRight: '8px',
                      backgroundColor: link.category === 'OECD Request' ? '#fde7e9' : '#dff6dd',
                      color: link.category === 'OECD Request' ? '#a4262c' : '#107c10'
                    }}>
                      {link.category === 'OECD Request' ? 'OECD' : 'Section'}
                    </span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0078d4', fontSize: '14px' }}>{link.label}</a>
                  </div>
                  <button onClick={() => removeLink(link.id)} style={{ color: '#a4262c', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
              {(formData.links || []).length === 0 && <div style={{ color: '#605e5c', fontSize: '13px', fontStyle: 'italic' }}>No links added yet.</div>}
            </div>

            {/* Add new link form */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '3px' }}>Label</label>
                <input 
                  type="text" 
                  value={newLink.label}
                  onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                  placeholder="e.g. OECD Request File"
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 2 }}>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '3px' }}>URL</label>
                <input 
                  type="text" 
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://tenant.sharepoint.com/..."
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '3px' }}>Category</label>
                <select 
                  value={newLink.category}
                  onChange={(e) => setNewLink({ ...newLink, category: e.target.value as any })}
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="OECD Request">OECD Request</option>
                  <option value="Section Answer">Section Answer</option>
                </select>
              </div>
              <button 
                onClick={addLink}
                style={{ padding: '6px 12px', backgroundColor: '#0078d4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Add
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', gridColumn: 'span 2' }}>
            <button 
              onClick={handleSave} 
              className={styles.navButton} 
              style={{ margin: 0, backgroundColor: '#107c10', padding: '10px 24px' }}
            >
              {isEditMode ? 'Save Changes' : 'Create Follow-up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
