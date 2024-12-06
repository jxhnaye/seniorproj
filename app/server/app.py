import requests
import pandas as pd
import matplotlib
matplotlib.use('Agg')
from matplotlib import font_manager, rcParams
import matplotlib.pyplot as plt
from io import BytesIO
from flask import Flask, request, send_file, jsonify
from flask import abort
from flask_cors import CORS

path = r'C:\Users\johna\Downloads\Parkinsans.ttf'
font_manager.fontManager.addfont(path)
rcParams['font.family'] = 'Parkinsans'

app = Flask(__name__)
CORS(app)

def fetch_data(league_id, swid, espn_s2, season):
    columns = ['Week', 'Team', 'Player', 'Lineup Slot', 'Position', 'Projected', 'Actual', 'Player ID', 'Image URL']
    eligible_positions = {
        0: 'QB', 
        2: 'RB', 
        4: 'WR', 
        6: 'TE',
        16: 'D/ST', 
        17: 'K', 
        20: 'Bench', 
        21: 'IR', 
        23: 'Flex'
    }
    
    projection_data = []
    for week in range(1, 15):
        url = f'https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/{season}/segments/0/leagues/{league_id}?scoringPeriodId={week}&view=mBoxscore&view=mMatchupScore&view=mRoster'
        r = requests.get(url, cookies={'SWID': swid, 'espn_s2': espn_s2})
        try:
            espn_raw_data = r.json()
        except ValueError:
            print("Failed to decode JSON from response.")
            continue
        if 'teams' not in espn_raw_data:
            print(f"Key 'teams' not found in response for week {week}")
            continue
        for team in espn_raw_data['teams']:
            team_name = team.get('abbrev', 'Unknown')
            for player in team['roster']['entries']:
                player_data = player['playerPoolEntry']['player']
                player_name = player_data['fullName']
                player_id = player_data['id']
                lineup_slot = player['lineupSlotId']
                position = eligible_positions.get(lineup_slot, 'Unknown')

                if position == 'D/ST':
                    pro_team_id = player_data.get('proTeamId')
                    if pro_team_id is not None:
                        image_url = f"https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/{pro_team_id}.png&h=150&w=150"
                    else:
                        image_url = '/path/to/default-logo.png' 
                else:
                    image_url = f"https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/{player_id}.png&w=96&h=70&cb=1"

                projected, actual = None, None
                for stats in player_data['stats']:
                    if stats['scoringPeriodId'] != week:
                        continue
                    if stats['statSourceId'] == 0:
                        actual = stats['appliedTotal']
                    elif stats['statSourceId'] == 1:
                        projected = stats['appliedTotal']
                
                projection_data.append([
                    week, team_name, player_name, lineup_slot, position, projected, actual, player_id, image_url
                ])
    
    # Create a DataFrame with the new columns for Player ID and Image URL
    df = pd.DataFrame(projection_data, columns=columns)
    
    # Define custom sorting order for positions
    position_order = {
        'QB': 1, 
        'RB': 2, 
        'WR': 3, 
        'TE': 4, 
        'Flex': 5, 
        'D/ST': 6, 
        'K': 7, 
        'Bench': 8, 
        'IR': 9
    }
    
    # Sort by week and then by custom position order
    df['Position Order'] = df['Position'].map(position_order)
    df = df.sort_values(['Week', 'Position Order']).drop(columns=['Position Order'])
    
    df['Projected'] = df['Projected'].round(2)
    df['Actual'] = df['Actual'].round(2)
    return df.fillna(0)



def plot_team(df, team_abbrev):
    df2 = df[df['Team'].str.upper() == team_abbrev.upper()]
    if df2.empty:
        return None

    plot_data = df2[['Week', 'Projected', 'Actual']].groupby(['Week']).sum().reset_index()
    
    plt.figure(figsize=(14, 6), facecolor='none')
    plt.plot(
        plot_data['Week'], 
        plot_data['Projected'], 
        color='purple',       
        linestyle='-',     
        marker='o',         
        label='Projected', 
        linewidth=2, 
        markersize=6
    )
    plt.plot(
        plot_data['Week'], 
        plot_data['Actual'], 
        color='green',        
        linestyle='-',     
        marker='o',         
        label='Actual', 
        linewidth=2, 
        markersize=6
    )
    plt.title(f"{team_abbrev} Projected vs. Actual Points", fontsize=24, color="#eaddca")
    plt.xlabel("Week", fontsize=16, color="#eaddca")
    plt.ylabel("Points", fontsize=16, color="#eaddca")
    plt.legend(loc="lower center", fontsize=12, frameon=False)
    plt.grid(color="#eaddca", linestyle="--", linewidth=0.5)
    plt.xticks(plot_data['Week'], fontsize=12)
    plt.yticks(fontsize=12)
    plt.tight_layout()
    plt.gca().set_facecolor('#f8f8f8')
    
    return True

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    league_id = data.get('leagueId')
    swid = data.get('swid')
    espn_s2 = data.get('espnS2')
    season_year = data.get('seasonYear')
    team_name = data.get('teamName')

    if not all([league_id, swid, espn_s2, season_year, team_name]):
        abort(400, description="Missing required fields. Please check your input.")
    
    df = fetch_data(league_id, swid, espn_s2, season_year)
    
    team_data = df[df['Team'].str.upper() == team_name.upper()].to_dict(orient="records")
    
    return jsonify(team_data)

@app.route('/plot', methods=['GET'])
def plot():
    team_name = request.args.get('teamName')
    league_id = request.args.get('leagueId')
    swid = request.args.get('swid')
    espn_s2 = request.args.get('espnS2')
    season_year = request.args.get('seasonYear')

    df = fetch_data(league_id, swid, espn_s2, season_year)

    if plot_team(df, team_name) is None:
        return jsonify({"error": f"No data found for team '{team_name}'. Please check the team name and try again."}), 400

    buffer = BytesIO()
    plt.savefig(buffer, format="png", transparent=True) 
    buffer.seek(0)
    plt.close()  
    return send_file(buffer, mimetype='image/png')

if __name__ == '__main__':
    app.run(port=5000, debug=True)
