function redirectToStore(url) {
    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', async () => {
    const gamesContainer = document.getElementById('games-container');
  
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:3000/shop');
        const games = await response.json();
        return games;
      } catch (error) {
        console.error('Error fetching games:', error);
        return [];
      }
    };
  
    const voteForGame = async (id) => {
      try {
        const response = await fetch(`http://localhost:3000/shop/${id}/vote`, {
          method: 'PUT'
        });
        const game = await response.json();
        alert('Thank you for voting!');
        return game;
      } catch (error) {
        console.error('Error voting for game:', error);
        alert('Voting failed. Please try again.');
      }
    };
  
    const renderGames = (games) => {
      gamesContainer.innerHTML = '';
      games.forEach((game) => {
        const gameElement = document.createElement('div');
        gameElement.classList.add('game');
        gameElement.innerHTML = `
          <div class="game-info">
            <h2>${game.Title}</h2>
            <p>Platform: ${game.Platform}</p>
            <p>Price: ${game.Price}</p>
            <p>Votes: ${game.Votes || 0}</p>
          </div>
          <button class="vote-button" onclick="voteForGame('${game._id}')">Vote</button>
        `;
        gamesContainer.appendChild(gameElement);
      });
    };
  
    const games = await fetchGames();
    renderGames(games);
  
    window.voteForGame = async (id) => {
      await voteForGame(id);
      const updatedGames = await fetchGames();
      renderGames(updatedGames);
    };
  });