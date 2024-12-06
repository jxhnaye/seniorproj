import React, { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import "./styles.scss";

const Analyzer = () => {
  const [formData, setFormData] = useState({
    leagueId: "",
    swid: "",
    espnS2: "",
    seasonYear: "",
    teamName: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [plotImage, setPlotImage] = useState(null);
  const [teamData, setTeamData] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handleWeekChange = (e) => {
    setSelectedWeek(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) newErrors[key] = `${key} is required.`;
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true); // Show loading spinner
    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ general: errorData.error || "An error occurred" });
        return;
      }

      const data = await response.json();
      const groupedData = data.reduce((acc, player) => {
        const week = player.Week;
        if (!acc[week]) acc[week] = [];
        acc[week].push(player);
        return acc;
      }, {});

      setTeamData(groupedData);
      const availableWeeks = Object.keys(groupedData);
      if (availableWeeks.length > 0) setSelectedWeek(availableWeeks[0]);

      const plotResponse = await fetch(
        `http://127.0.0.1:5000/plot?teamName=${formData.teamName}&leagueId=${formData.leagueId}&swid=${formData.swid}&espnS2=${formData.espnS2}&seasonYear=${formData.seasonYear}`
      );


      if (plotResponse.ok) {
        const blob = await plotResponse.blob();
        setPlotImage(URL.createObjectURL(blob));
      } else {
        setErrors({ general: "Failed to fetch plot image" });
      }
    } catch (error) {
      setErrors({ general: error.message || "An unexpected error occurred" });
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <ProtectedRoute>

      <div className="analyzer">
        <h1 className='analyzer-header'>
          Fantasy Football Analyzer</h1>
        <form onSubmit={handleSubmit} className="analyzer-form">
          {errors.general && <p className="error-message">{errors.general}</p>}

          {Object.keys(formData).map((field) => {
            const fieldLabels = {
              leagueId: "League ID",
              swid: "SWID",
              espnS2: "ESPN S2",
              seasonYear: "Season Year",
              teamName: "Team Name",
            };

            return (
              <div key={field} className="form-group">
                <label>{fieldLabels[field]}:</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={errors[field] ? "error-input" : ""}
                  placeholder={errors[field] || `Enter ${fieldLabels[field]}`}
                />
              </div>
            );
          })}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Loading..." : "Calculate"}
          </button>
        </form>

        {plotImage && (
          <div className="plot-container">
            <h2>Analysis Plot</h2>
            <img src={plotImage} alt="Analysis Plot" />
          </div>
        )}

        {Object.keys(teamData).length > 0 && (
          <div className="team-data">
            <h2 className="team-data-header">Roster and Stats for Team {formData.teamName}</h2>
            <label>Select Week:</label>
            <select value={selectedWeek} onChange={handleWeekChange}>
              {Object.keys(teamData).map((week) => (
                <option key={week} value={week}>
                  Week {week}
                </option>
              ))}
            </select>
            {selectedWeek && (
              <div className="week-data">
                <div className="container starters">
                  <h3>Starters</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Position</th>
                        <th>Projected</th>
                        <th>Actual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamData[selectedWeek]
                        .filter((p) => p.Position !== "Bench")
                        .map((player, index) => (
                          <tr key={index}>
                            <td>
                              <img
                                src={player["Image URL"] || "/default.png"}
                                alt={player.Player}
                                style={{ width: 48, height: 36, marginRight: 5 }}
                              />
                              {player.Player}
                            </td>
                            <td>{player.Position}</td>
                            <td>{player.Projected.toFixed(2)}</td>
                            <td>{player.Actual.toFixed(2)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="container bench">
                  <h3>Bench</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Position</th>
                        <th>Projected</th>
                        <th>Actual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamData[selectedWeek]
                        .filter((p) => p.Position === "Bench")
                        .map((player, index) => (
                          <tr key={index}>
                            <td>
                              <img
                                src={player["Image URL"] || "/default.png"}
                                alt={player.Player}
                                style={{ width: 48, height: 36, marginRight: 5 }}
                              />
                              {player.Player}
                            </td>
                            <td>{player.Position}</td>
                            <td>{player.Projected.toFixed(2)}</td>
                            <td>{player.Actual.toFixed(2)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Analyzer;