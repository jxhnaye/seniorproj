import React from "react";
import "./styles.scss";

const About = () => {
  return (
    <div className="about">
      <h1>About RocketMetrics</h1>
      <p>
        Welcome to RocketMetrics! This platform provides a Fantasy Football Analyzer that helps you assess the performance of your team and make informed decisions based on detailed visualizations and data analysis. 
        <br/>
        <br/>
        <strong>Note: This analyzer only works for ESPN fantasy football teams at the moment.</strong>
      </p>

      <h2>How to Use the Analyzer</h2>
      <ol className="instructions-list">
        <li>
          <strong>Navigate to the Analyzer:</strong> Click on the <em>Analyzer</em> link in the top-right menu of the page.
        </li>
        <li>
          <strong>Enter Your League Information:</strong> Provide the following details:
          <ul>
            <li>
              <strong>League ID:</strong> This is your Fantasy Football league's unique identifier.
            </li>
            <li>
              <strong>SWID:</strong> This value is required to authenticate your league. You can find it in your browser cookies.
            </li>
            <li>
              <strong>ESPN S2:</strong> This is also found in your browser cookies. It’s required to fetch your data securely.
            </li>
            <li>
              <strong>Season Year:</strong> Enter the year of the fantasy football season you wish to analyze.
            </li>
            <li>
              <strong>Team Name:</strong> Provide your team's name to specify the analysis scope.
            </li>
          </ul>
        </li>
        <li>
          <strong>Click "Calculate":</strong> Once all fields are filled, click the <em>Calculate</em> button. The Analyzer will fetch and process the data, displaying various visual insights, including your team's projected vs. actual points.
        </li>
        <li>
          <strong>Review the Results:</strong> Analyze the data visualizations and tables:
          <ul>
            <li>The <em>Projected vs. Actual Points</em> chart will show your team's weekly performance compared to expectations.</li>
            <li>The <em>Roster Table</em> shows player statistics, including both starters and bench players for each week.</li>
          </ul>
        </li>
      </ol>

      <h2>Benefits of Using the Analyzer</h2>
      <ul className="benefits-list">
        <li>Track weekly performance of your fantasy team effectively.</li>
        <li>Gain insights into which players are overperforming or underperforming.</li>
        <li>Make data-driven decisions for trades and lineup changes.</li>
      </ul>
    </div>
  );
};

export default About;
