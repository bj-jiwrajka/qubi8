import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { Poppins } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { FaPlus } from "react-icons/fa";
import companiesData from "@/data/companies.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const [company, setCompany] = useState("All Companies");
  const [topic, setTopic] = useState("All");
  const [questions, setQuestions] = useState([]);
  const [isSearching, setisSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleSearch = async () => {
    setisSearching(true);
    setQuestions([]);
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
        setisSearching(false);
        if (data.length === 0) {
          toast.info("No questions found");
        }
      } else {
        toast.error("Failed to fetch questions:", data.message);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setisSearching(false);
    }
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (companyName) => {
    setCompany(companyName);
    setSearchTerm(companyName);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCompanies = companiesData
    .sort()
    .filter((comp) => comp.toLowerCase().startsWith(searchTerm.toLowerCase()));

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
            <div className={styles.customDropdown} ref={dropdownRef}>
              <input
                type="text"
                className={styles.dropdownInput}
                placeholder="Search for a company"
                value={searchTerm}
                onClick={handleDropdownClick}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isDropdownOpen && (
                <div className={styles.dropdownOptions}>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((comp, index) => (
                      <div
                        key={index}
                        className={styles.dropdownOption}
                        onClick={() => handleOptionClick(comp)}
                      >
                        {comp}
                      </div>
                    ))
                  ) : (
                    <div className={styles.noOptions}>No options available</div>
                  )}
                </div>
              )}
            </div>
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

          <button
            className={styles.button}
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>

          <div className={styles.questionList}>
            {questions?.map((q, index) => (
              <div key={index} className={styles.questionItem}>
                {q.question}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
