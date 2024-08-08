import { useState, useEffect, useRef } from "react";
import companiesData from "@/data/companies.json";
import styles from "../styles/AddQuestion.module.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddQuestion() {
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState("Others");
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/add-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company, topic, question }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      toast.success("Question successfully added!");
      setCompany("");
      setTopic("Others");
      setQuestion("");
    } catch (error) {
      toast.error("Error:", error);
    } finally {
      setIsSubmitting(false);
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
  const filteredCompanies = companiesData
    .sort()
    .filter((comp) => comp.toLowerCase().startsWith(searchTerm.toLowerCase()));
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

  return (
    <div className={styles.container}>
      <h1>Add Question</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
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
        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
