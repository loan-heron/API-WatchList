function renderList(films) {
  const container = document.getElementById('film-list');
  container.textContent = '';

  if (films.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'Aucun film à afficher';
    container.append(message);
    return;
  }

  films.forEach(function (film) {
    container.append(renderCard(film));
  });
}

function renderStats(films) {
  let vus = 0;
  let aVoir = 0;

  films.forEach(function (film) {
    if (film.status === 'vu') {
      vus = vus + 1;
    } else if (film.status === 'aVoir') {
      aVoir = aVoir + 1;
    }
  });

  const stats = document.getElementById('stats');
  stats.textContent = `Total : ${films.length} | Vus : ${vus} | À voir : ${aVoir}`;
}
