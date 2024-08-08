import { useState } from 'react';
import companiesData from '@/data/companies.json';
import styles from '../styles/AddQuestion.module.scss';

export default function AddQuestion() {
  const [company, setCompany] = useState('');
  const [topic, setTopic] = useState('Others');
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/add-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company, topic, question }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData.message);
        return;
      }

      const data = await response.json();
      console.log('Success:', data.message);
      setCompany('');
      setTopic('OS');
      setQuestion('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Add Question</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Company Name:</label>
          <select
            className={styles.input}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            {companiesData.map((comp, index) => (
              <option key={index} value={comp}>{comp}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Topic:</label>
          <select
            className={styles.input}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="OS">OS</option>
            <option value="CN">CN</option>
            <option value="DBMS">DBMS</option>
            <option value="OOPS">OOPS</option>
            <option value="DSA">DSA</option>
            <option value="Puzzles">Puzzles</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Question:</label>
          <textarea
            className={styles.input}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <button className={styles.button} type="submit">Submit</button>
      </form>
    </div>
  );
}
