import React from 'react';

const reviews = [
  { title: 'Ótima experiência!', body: 'Adotei um novo amigo para a vida.', reviewer: 'Carlos' },
  { title: 'Maravilhoso!', body: 'A adoção foi rápida e fácil.', reviewer: 'Ana' },
  { title: 'Recomendo!', body: 'Encontrei o melhor pet aqui.', reviewer: 'Lucas' }
];

const Reviews = () => {
  return (
    <section className="reviews">
      <h2>Quem adotou</h2>
      <div className="review-cards">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <h3>{review.title}</h3>
            <p>{review.body}</p>
            <span>{review.reviewer}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;