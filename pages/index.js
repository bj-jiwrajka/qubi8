import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Poppins } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { FaPlus } from "react-icons/fa";
import companiesData from "@/data/companies.json";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const [company, setCompany] = useState("All Companies");
  const [topic, setTopic] = useState("All");
  const [questions, setQuestions] = useState([]);

  const handleSearch = async () => {
    try {
      const query = [];
      if (company !== "All Companies") {
        query.push(`company=${encodeURIComponent(company)}`);
      }
      if (topic !== "All") {
        query.push(`topic=${encodeURIComponent(topic)}`);
      }

      const response = await fetch(`/api/get-questions?${query.join("&")}`);
      const data = await response.json();
      if (response.ok) {
        setQuestions(data);
      } else {
        console.error("Failed to fetch questions:", data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className={poppins.className}>
      <Head>
        <title>QubI8</title>
        <meta
          name="description"
          content="A portal for adding and viewing interview questions"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>
          QubI8: Your Go-To Hub for Interview Questions
        </h1>
      </header>

      <main className={styles.main}>
        <div className={styles.addQuestion}>
          <Link legacyBehavior href="/add-question">
            <a className={styles.iconLink}>
              <FaPlus className={styles.icon} />
              <p className={styles.addText}>Add Question</p>
            </a>
          </Link>
        </div>

        <div className={styles.viewQuestions}>
          <div className={styles.searchGroup}>
            <label className={styles.label}>Company Name:</label>
            <select
              className={styles.input}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              <option value="All Companies">All Companies</option>
              {companiesData.map((comp, index) => (
                <option key={index} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.searchGroup}>
            <label className={styles.label}>Topic:</label>
            <select
              className={styles.input}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="All">All Topics</option>
              <option value="OS">OS</option>
              <option value="CN">CN</option>
              <option value="DBMS">DBMS</option>
              <option value="OOPS">OOPS</option>
              <option value="DSA">DSA</option>
              <option value="Puzzles">Puzzles</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <button className={styles.button} onClick={handleSearch}>
            Search
          </button>

          <div className={styles.questionList}>
            {questions.length > 0 ? (
              questions.map((q, index) => (
                <div key={index} className={styles.questionItem}>
                  {q.question}
                </div>
              ))
            ) : (
              <div>No questions found</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
