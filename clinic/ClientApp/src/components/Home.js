import React, { Component } from 'react';
import UserContext from './UserContext'; // Import UserContext

export class Home extends Component {
  static displayName = Home.name;
  
  render() {
    return (
      <UserContext.Consumer>
        {({ getRoleName }) => {
          const roleName = getRoleName();
          const randomFact = getRandomFact();

          return (
            <div>
              <h1>Hello User!</h1>
              <h2 style={{ fontWeight: 'bold' }}>Logged in as: {roleName}</h2> {/* Display user role */}
              <p>Random Hospital Fact:</p>
              <blockquote>
                {randomFact}
              </blockquote>
              {/* Rest of the content */}
            </div>
          );
        }}
      </UserContext.Consumer>
    );
  }
}

const hospitalFacts = [
  "The first known hospital was established in Sri Lanka in 431 B.C.",
  "The oldest running hospital is in Paris, founded in 651.",
  "Florence Nightingale, the founder of modern nursing, was born in 1820.",
  // Add more facts as needed
];

function getRandomFact() {
  const randomIndex = Math.floor(Math.random() * hospitalFacts.length);
  return hospitalFacts[randomIndex];
}
