-- Table minimale attendue :
-- create table public.films (
--   id bigint generated always as identity primary key,
--   title text not null,
--   genre text not null,
--   year integer not null,
--   image text not null default '',
--   status text not null default 'aVoir',
--   rating integer not null default 0
-- );

insert into public.films (id, title, genre, year, image, status, rating)
values
  (1, 'Inception', 'SF', 2010, 'images/inception.jpg', 'vu', 4),
  (2, 'Parasite', 'Drame', 2019, 'images/parasite.jpg', 'vu', 5),
  (3, 'Intouchables', 'Comédie', 2011, 'images/intouchables.jpg', 'vu', 5),
  (4, 'Shutter Island', 'Thriller', 2010, 'images/shutter-island.jpg', 'vu', 4),
  (5, 'Le Voyage de Chihiro', 'Animation', 2001, 'images/chihiro.jpg', 'vu', 5),
  (6, 'Interstellar', 'SF', 2014, 'images/interstellar.jpg', 'aVoir', 0),
  (7, 'The Grand Budapest Hotel', 'Comédie', 2014, 'images/grand-budapest-hotel.jpg', 'aVoir', 0),
  (8, 'Gladiator', 'Drame', 2000, 'images/gladiator.jpg', 'aVoir', 0),
  (9, 'Se7en', 'Thriller', 1995, 'images/se7en.jpg', 'aVoir', 0),
  (10, 'Toy Story', 'Animation', 1995, 'images/toy-story.jpg', 'aVoir', 0),
  (11, 'Dune', 'SF', 2021, 'images/dune.jpg', 'aVoir', 0),
  (12, 'The Social Network', 'Drame', 2010, 'images/social-network.jpg', 'aVoir', 0)
on conflict (id) do update
set
  title = excluded.title,
  genre = excluded.genre,
  year = excluded.year,
  image = excluded.image,
  status = excluded.status,
  rating = excluded.rating;

select setval(
  pg_get_serial_sequence('public.films', 'id'),
  coalesce((select max(id) from public.films), 1),
  true
);
