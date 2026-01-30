import * as React from 'react';
import styles from './Dashboard.module.scss';
import type { IDashboardProps } from './IDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { HashRouter, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import { SummaryView } from './SummaryView';
import { QuestionnairesView } from './QuestionnairesView';
import { QuestionnaireDetailView } from './QuestionnaireDetailView';
import { QuestionnaireFormView } from './QuestionnaireFormView';
import { FollowUpsView } from './FollowUpsView';
import { FollowUpFormView } from './FollowUpFormView';
import { HomeView } from './HomeView';

export default class Dashboard extends React.Component<IDashboardProps> {
  public render(): React.ReactElement<IDashboardProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      spHttpClient,
      siteUrl
    } = this.props;

    return (
      <HashRouter>
        <section className={`${styles.dashboard} ${hasTeamsContext ? styles.teams : ''}`}>
          <header className={styles.header}>
            <h2 className={styles.headerTitle}>INA OECD - POST IM</h2>
            <nav className={styles.navMenu}>
              <NavLink
                to="/"
                className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
              >
                Home
              </NavLink>
              <NavLink
                to="/summary"
                className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
              >
                Summary
              </NavLink>
              <NavLink 
                to="/questionnaires" 
                className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
              >
                Questionnaires
              </NavLink>
              <NavLink 
                to="/followups" 
                className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
              >
                Follow ups
              </NavLink>
            </nav>
          </header>

          <div className={styles.welcome} style={{ marginBottom: '20px' }}>
            <p>Welcome back, <strong>{escape(userDisplayName)}</strong>!</p>
          </div>

          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/summary" element={<SummaryView />} />
            <Route path="/questionnaires" element={<QuestionnairesView />} />
            <Route path="/questionnaire/new" element={<QuestionnaireFormView />} />
            <Route path="/questionnaire/edit/:id" element={<QuestionnaireFormView />} />
            <Route path="/questionnaire/:id" element={<QuestionnaireDetailView />} />
            <Route path="/followups" element={<FollowUpsView />} />
            <Route path="/followup/new" element={<FollowUpFormView />} />
            <Route path="/followup/edit/:id" element={<FollowUpFormView />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          <div style={{ marginTop: '20px' }}>
            <div>{environmentMessage}</div>
            <div>Web part property value: <strong>{escape(description)}</strong></div>
          </div>


        </section>
      </HashRouter>
    );
  }
}
