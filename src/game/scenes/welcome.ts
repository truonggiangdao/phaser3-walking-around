export const createWelcomeDiv = () => {
  const div = document.createElement('div');
  div.id = 'welcome';
  div.innerHTML = `
    <div class="welcome-text">This is a test to allow controlling charactor to go around in the map.</div>
    <div class="welcome-btn">Click to start game</div>
  `;

  document.body.appendChild(div);

  return div;
};